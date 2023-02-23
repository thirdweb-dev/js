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
import type {
  TieredDropLogic,
  ISignatureAction,
} from "@thirdweb-dev/contracts-js";
import {
  TokensLazyMintedEvent,
  TokensClaimedEvent,
} from "@thirdweb-dev/contracts-js/dist/declarations/src/TieredDropLogic";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumberish, ethers } from "ethers";
import invariant from "tiny-invariant";

export class Erc721TieredDrop implements DetectableFeature {
  featureName = FEATURE_NFT_TIERED_DROP.name;

  private contractWrapper: ContractWrapper<TieredDropLogic>;
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<TieredDropLogic>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  public async getMetadataInTier(
    tier: string,
  ): Promise<Omit<NFTMetadata, "id">[]> {
    const tiers =
      await this.contractWrapper.readContract.getMetadataForAllTiers();
    const batches = tiers.find((t) => t.tier === tier);

    if (!batches) {
      throw new Error("Tier not found in contract.");
    }

    const nfts = await Promise.all(
      batches.ranges.map(async (range, i) => {
        const nftsInRange = [];
        const baseUri = batches.baseURIs[i].replace(/\/$/, "");

        const isDelayedReveal =
          await this.contractWrapper.readContract.isEncryptedBatch(
            range.endIdNonInclusive,
          );

        for (
          let j = range.startIdInclusive.toNumber();
          j < range.endIdNonInclusive.toNumber();
          j++
        ) {
          const uri = isDelayedReveal
            ? `${baseUri}/${range.startIdInclusive.toNumber()}`
            : `${baseUri}/${j}`;

          const metadata: NFTMetadata = await this.storage.downloadJSON(uri);
          nftsInRange.push(metadata);
        }

        return nftsInRange;
      }),
    );

    return await Promise.all(nfts.flat());
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

  public async createBatchWithTier(
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

    const startingIndex = event[0].args[1];
    const endingIndex = event[0].args[2];
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

  public async createDelayedRevealBatchWithTier(
    placeholder: NFTMetadataOrUri,
    metadatas: NFTMetadataOrUri[],
    password: string,
    tier: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {
    if (!password) {
      throw new Error("Password is required");
    }
    const placeholderUris = await uploadOrExtractURIs(
      [placeholder],
      this.storage,
    );
    const placeholderUri = getBaseUriFromBatch(placeholderUris);
    const startFileNumber = await this.erc721.nextTokenIdToMint();
    const uris = await uploadOrExtractURIs(
      metadatas,
      this.storage,
      startFileNumber.toNumber(),
      options,
    );

    const baseUri = getBaseUriFromBatch(uris);
    const baseUriId = await this.contractWrapper.readContract.getBaseURICount();
    const chainId = await this.contractWrapper.getChainID();
    const hashedPassword = ethers.utils.solidityKeccak256(
      ["string", "uint256", "uint256", "address"],
      [password, chainId, baseUriId, this.contractWrapper.readContract.address],
    );

    const encryptedBaseUri =
      await this.contractWrapper.readContract.encryptDecrypt(
        ethers.utils.toUtf8Bytes(baseUri),
        hashedPassword,
      );

    let data: string;
    const provenanceHash = ethers.utils.solidityKeccak256(
      ["bytes", "bytes", "uint256"],
      [ethers.utils.toUtf8Bytes(baseUri), hashedPassword, chainId],
    );
    data = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "bytes32"],
      [encryptedBaseUri, provenanceHash],
    );

    const receipt = await this.contractWrapper.sendTransaction("lazyMint", [
      uris.length,
      placeholderUri.endsWith("/") ? placeholderUri : `${placeholderUri}/`,
      tier,
      data,
    ]);

    const event = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
      "TokensLazyMinted",
      receipt?.logs,
    );
    const startingIndex = event[0].args[1];
    const endingIndex = event[0].args[2];
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

  public async reveal(
    batchId: BigNumberish,
    password: string,
  ): Promise<TransactionResult> {
    if (!password) {
      throw new Error("Password is required");
    }
    const chainId = await this.contractWrapper.getChainID();
    const key = ethers.utils.solidityKeccak256(
      ["string", "uint256", "uint256", "address"],
      [password, chainId, batchId, this.contractWrapper.readContract.address],
    );
    // performing the reveal locally to make sure it'd succeed before sending the transaction
    try {
      const decryptedUri = await this.contractWrapper
        .callStatic()
        .reveal(batchId, key);
      // basic sanity check for making sure decryptedUri is valid
      // this is optional because invalid decryption key would result in non-utf8 bytes and
      // ethers would throw when trying to decode it
      if (!decryptedUri.includes("://") || !decryptedUri.endsWith("/")) {
        throw new Error("invalid password");
      }
    } catch (e) {
      throw new Error("invalid password");
    }

    return {
      receipt: await this.contractWrapper.sendTransaction("reveal", [
        batchId,
        key,
      ]),
    };
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
  ): Promise<TransactionResultWithId<NFT>[]> {
    const message = await this.mapPayloadToContractStruct(
      signedPayload.payload,
    );
    const normalizedTotalPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      signedPayload.payload.price,
      signedPayload.payload.currencyAddress,
    );

    const overrides = await this.contractWrapper.getCallOverrides();
    await setErc20Allowance(
      this.contractWrapper,
      normalizedTotalPrice,
      signedPayload.payload.currencyAddress,
      overrides,
    );

    const receipt = await this.contractWrapper.sendTransaction(
      "claimWithSignature",
      [message, signedPayload.signature],
      overrides,
    );
    const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
      "TokensClaimed",
      receipt?.logs,
    );
    const startingIndex = event[0].args.startTokenId;
    const endingIndex = startingIndex.add(event[0].args.quantityClaimed);
    const results: TransactionResultWithId<NFT>[] = [];
    for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
      results.push({
        id,
        receipt,
        data: () => this.erc721.get(id),
      });
    }

    return results;
  }

  private async mapPayloadToContractStruct(
    payload: TieredDropPayloadOutput,
  ): Promise<ISignatureAction.GenericRequestStruct> {
    const normalizedTotalPrice = await normalizePriceValue(
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
        normalizedTotalPrice,
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
