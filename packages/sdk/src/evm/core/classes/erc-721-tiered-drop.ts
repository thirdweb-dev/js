import { NFT, NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import { normalizePriceValue, setErc20Allowance } from "../../common/currency";
import { getBaseUriFromBatch, uploadOrExtractURIs } from "../../common/nft";
import { FEATURE_NFT_TIERED_DROP } from "../../constants/erc721-features";
import { GenericRequest } from "../../schema";
import {
  TieredDropPayloadInput,
  TieredDropPayloadOutput,
  TieredDropPayloadSchema,
  TieredDropPayloadWithSignature,
} from "../../schema/contracts/tiered-drop";
import { UploadProgressEvent } from "../../types/events";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResult, TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721 } from "./erc-721";
import type { TieredDrop, ISignatureAction } from "@thirdweb-dev/contracts-js";
import { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TieredDrop";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import invariant from "tiny-invariant";

export class Erc721TieredDrop implements DetectableFeature {
  featureName = FEATURE_NFT_TIERED_DROP.name;

  private contractWrapper: ContractWrapper<TieredDrop>;
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<TieredDrop>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  public async getMetadataInTier(
    tier: string,
  ): Promise<Omit<NFTMetadata, "id">[]> {
    const batches = await this.contractWrapper.readContract.getMetadataInTier(
      tier,
    );

    const nfts = await Promise.all(
      batches.tokens
        .map((range, i) => {
          const nftsInRange = [];
          const baseUri = batches.baseURIs[i];
          for (
            let j = range.startIdInclusive.toNumber();
            j < range.endIdNonInclusive.toNumber();
            j++
          ) {
            const uri = `${baseUri}/${j}`;
            const metadata = this.storage.downloadJSON(uri);
            nftsInRange.push(metadata);
          }

          return nftsInRange;
        })
        .flat(),
    );

    return nfts;
  }

  public async getTokensInTier(tier: string): Promise<NFT[]> {
    const endIndex =
      await this.contractWrapper.readContract.getTokensInTierLen();
    if (endIndex.eq(0)) {
      return [];
    }

    const ranges = await this.contractWrapper.readContract.getTokensInTier(
      tier,
      0,
      endIndex,
    );

    const nfts = await Promise.all(
      ranges
        .map((range) => {
          const nftsInRange = [];
          for (
            let i = range.startIdInclusive.toNumber();
            i < range.endIdNonInclusive.toNumber();
            i++
          ) {
            nftsInRange.push(this.erc721.get(i));
          }
          return nftsInRange;
        })
        .flat(),
    );

    return nfts;
  }

  public async lazyMintWithTier(
    metadatas: NFTMetadataOrUri[],
    tier: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {
    // TODO: Change this to on extension
    const startFileNumber = await this.erc721.nextTokenIdToMint();
    const batch = await uploadOrExtractURIs(
      metadatas,
      this.storage,
      startFileNumber.toNumber(),
      options,
    );
    const baseUri = getBaseUriFromBatch(batch);

    const receipt = await this.contractWrapper.sendTransaction("lazyMint", [
      batch.length,
      baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
      tier,
      ethers.utils.toUtf8Bytes(""),
    ]);

    const event = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
      "TokensLazyMinted",
      receipt?.logs,
    );
    const startingIndex = event[0].args.startTokenId;
    const endingIndex = event[0].args.endTokenId;
    const results: TransactionResultWithId<NFTMetadata>[] = [];
    for (let id = startingIndex; id.lte(endingIndex); id = id.add(1)) {
      results.push({
        id,
        receipt,
        data: () => this.erc721.getTokenMetadata(id),
      });
    }
    return results;
  }

  public async generate(
    payloadToSign: TieredDropPayloadInput,
  ): Promise<TieredDropPayloadWithSignature> {
    const [payload] = await this.generateBatch([payloadToSign]);
    return payload;
  }

  public async generateBatch(
    payloadsToSign: TieredDropPayloadInput[],
  ): Promise<TieredDropPayloadWithSignature[]> {
    const parsedPayloads = payloadsToSign.map((payload) =>
      TieredDropPayloadSchema.parse(payload),
    );
    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    return await Promise.all(
      parsedPayloads.map(async (payload) => {
        const signature = await this.contractWrapper.signTypedData(
          signer,
          {
            name: "SignatureAction",
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.readContract.address,
          },
          { GenericRequest: GenericRequest },
          await this.mapPayloadToContractStruct(payload),
        );

        return { payload, signature: signature.toString() };
      }),
    );
  }

  public async verify(
    signedPayload: TieredDropPayloadWithSignature,
  ): Promise<boolean> {
    const message = await this.mapPayloadToContractStruct(
      signedPayload.payload,
    );
    const verification = await this.contractWrapper.readContract.verify(
      message,
      signedPayload.signature,
    );
    return verification[0];
  }

  public async claimWithSignature(
    signedPayload: TieredDropPayloadWithSignature,
  ): Promise<TransactionResult> {
    const message = await this.mapPayloadToContractStruct(
      signedPayload.payload,
    );
    const pricePerToken = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      signedPayload.payload.price,
      signedPayload.payload.currencyAddress,
    );
    const price = pricePerToken.mul(signedPayload.payload.quantity);

    const overrides = await this.contractWrapper.getCallOverrides();
    await setErc20Allowance(
      this.contractWrapper,
      price,
      signedPayload.payload.currencyAddress,
      overrides,
    );

    const receipt = await this.contractWrapper.sendTransaction(
      "claimWithSignature",
      [message, signedPayload.signature],
      overrides,
    );

    // TODO: Listen for TokensClaimed event once it gets emitted
    return { receipt };
  }

  private async mapPayloadToContractStruct(
    payload: TieredDropPayloadOutput,
  ): Promise<ISignatureAction.GenericRequestStruct> {
    const normalizedPricePerToken = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      payload.price,
      payload.currencyAddress,
    );
    const data = ethers.utils.defaultAbiCoder.encode(
      [
        "string[]",
        "address",
        "address",
        "uint256",
        "address",
        "uint256",
        "uint256",
        "address",
      ],
      [
        payload.tierPriority,
        payload.to,
        payload.royaltyRecipient,
        payload.royaltyBps,
        payload.primarySaleRecipient,
        payload.quantity,
        normalizedPricePerToken,
        payload.currencyAddress,
      ],
    );

    return {
      uid: payload.uid,
      validityStartTimestamp: payload.mintStartTime,
      validityEndTimestamp: payload.mintEndTime,
      data,
    } as ISignatureAction.GenericRequestStruct;
  }
}
