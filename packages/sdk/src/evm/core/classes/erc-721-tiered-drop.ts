import type { ISignatureAction, TieredDrop } from "@thirdweb-dev/contracts-js";
import type { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/LazyMint";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TieredDrop";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumberish, utils } from "ethers";
import invariant from "tiny-invariant";
import type {
  NFT,
  NFTMetadata,
  NFTMetadataOrUri,
} from "../../../core/schema/nft";
import { CommonNFTInput, NFTMetadataInput } from "../../../core/schema/nft";
import { normalizePriceValue } from "../../common/currency/normalizePriceValue";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { getBaseUriFromBatch, uploadOrExtractURIs } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_TIERED_DROP } from "../../constants/erc721-features";
import {
  GenericRequest,
  TieredDropPayloadInput,
  TieredDropPayloadOutput,
  TieredDropPayloadSchema,
  TieredDropPayloadWithSignature,
} from "../../schema/contracts/tiered-drop";
import type { UploadProgressEvent } from "../../types/events";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import type { TransactionResultWithId } from "../types";
import type { ContractWrapper } from "./contract-wrapper";
import type { Erc721 } from "./erc-721";
import { Transaction } from "./transactions";

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
    const tiers = await this.contractWrapper.read("getMetadataForAllTiers", []);
    const batches = tiers.find((t) => t.tier === tier);

    if (!batches) {
      throw new Error("Tier not found in contract.");
    }

    const nfts = await Promise.all(
      batches.ranges
        .map((range, i) => {
          const nftsInRange = [];
          const baseUri = batches.baseURIs[i];
          for (
            let j = range.startIdInclusive.toNumber();
            j < range.endIdNonInclusive.toNumber();
            j++
          ) {
            const uri = baseUri.endsWith("/")
              ? `${baseUri}${j}`
              : `${baseUri}/${j}`;
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
    const endIndex = await this.contractWrapper.read("getTokensInTierLen", []);
    if (endIndex.eq(0)) {
      return [];
    }

    const ranges = await this.contractWrapper.read("getTokensInTier", [
      tier,
      0,
      endIndex,
    ]);

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

  createBatchWithTier = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      tier: string,
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      // TODO: Change this to on extension
      const startFileNumber = await this.erc721.nextTokenIdToMint();
      const batch = await uploadOrExtractURIs(
        metadatas,
        this.storage,
        startFileNumber.toNumber(),
        options,
      );
      const baseUri = getBaseUriFromBatch(batch);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          batch.length,
          baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
          tier,
          utils.toUtf8Bytes(""),
        ],
        parse: (receipt) => {
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
        },
      });
    },
  );

  createDelayedRevealBatchWithTier = /* @__PURE__ */ buildTransactionFunction(
    async (
      placeholder: NFTMetadataInput,
      metadatas: NFTMetadataInput[],
      password: string,
      tier: string,
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      if (!password) {
        throw new Error("Password is required");
      }

      const placeholderUris = await this.storage.uploadBatch(
        [CommonNFTInput.parse(placeholder)],
        {
          rewriteFileNames: {
            fileStartNumber: 0,
          },
        },
      );
      const placeholderUri = getBaseUriFromBatch(placeholderUris);
      const startFileNumber = await this.erc721.nextTokenIdToMint();
      const uris = await this.storage.uploadBatch(
        metadatas.map((m) => CommonNFTInput.parse(m)),
        {
          onProgress: options?.onProgress,
          rewriteFileNames: {
            fileStartNumber: startFileNumber.toNumber(),
          },
        },
      );

      const baseUri = getBaseUriFromBatch(uris);
      const baseUriId = await this.contractWrapper.read("getBaseURICount", []);
      const chainId = await this.contractWrapper.getChainID();
      const hashedPassword = utils.solidityKeccak256(
        ["string", "uint256", "uint256", "address"],
        [password, chainId, baseUriId, this.contractWrapper.address],
      );

      const encryptedBaseUri = await this.contractWrapper.read(
        "encryptDecrypt",
        [utils.toUtf8Bytes(baseUri), hashedPassword],
      );

      const provenanceHash = utils.solidityKeccak256(
        ["bytes", "bytes", "uint256"],
        [utils.toUtf8Bytes(baseUri), hashedPassword, chainId],
      );
      const data = utils.defaultAbiCoder.encode(
        ["bytes", "bytes32"],
        [encryptedBaseUri, provenanceHash],
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          uris.length,
          placeholderUri.endsWith("/") ? placeholderUri : `${placeholderUri}/`,
          tier,
          data,
        ],
        parse: (receipt) => {
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
        },
      });
    },
  );

  reveal = /* @__PURE__ */ buildTransactionFunction(
    async (batchId: BigNumberish, password: string) => {
      if (!password) {
        throw new Error("Password is required");
      }
      const chainId = await this.contractWrapper.getChainID();
      const key = utils.solidityKeccak256(
        ["string", "uint256", "uint256", "address"],
        [password, chainId, batchId, this.contractWrapper.address],
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

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "reveal",
        args: [batchId, key],
      });
    },
  );

  public async generate(
    payloadToSign: TieredDropPayloadInput,
  ): Promise<TieredDropPayloadWithSignature> {
    const [payload] = await this.generateBatch([payloadToSign]);
    return payload;
  }

  public async generateBatch(
    payloadsToSign: TieredDropPayloadInput[],
  ): Promise<TieredDropPayloadWithSignature[]> {
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");
    const parsedPayloads = await Promise.all(
      payloadsToSign.map((payload) =>
        TieredDropPayloadSchema.parseAsync(payload),
      ),
    );
    const chainId = await this.contractWrapper.getChainID();
    const contractStructs = await Promise.all(
      parsedPayloads.map((payload) => this.mapPayloadToContractStruct(payload)),
    );
    const signatures = await Promise.all(
      contractStructs.map((message) =>
        this.contractWrapper.signTypedData(
          signer,
          {
            name: "SignatureAction",
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.address,
          },
          { GenericRequest: GenericRequest },
          message,
        ),
      ),
    );
    return parsedPayloads.map((payload, index) => {
      const signature = signatures[index];
      return { payload, signature: signature.toString() };
    });
  }

  public async verify(
    signedPayload: TieredDropPayloadWithSignature,
  ): Promise<boolean> {
    const message = await this.mapPayloadToContractStruct(
      signedPayload.payload,
    );
    const verification = await this.contractWrapper.read("verify", [
      message,
      signedPayload.signature,
    ]);
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
    const data = utils.defaultAbiCoder.encode(
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
