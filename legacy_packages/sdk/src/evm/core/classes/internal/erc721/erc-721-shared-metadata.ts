import type { SharedMetadata } from "@thirdweb-dev/contracts-js";
import { isFileOrBuffer, type ThirdwebStorage } from "@thirdweb-dev/storage";
import { BasicNFTInput } from "../../../../../core/schema/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_NFT_SHARED_METADATA } from "../../../../constants/erc721-features";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { TransactionResult } from "../../../types";
import { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";

/**
 * Set shared metadata for ERC721 NFTs (Open Edition)
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.sharedMetadata.set(metadata);
 * ```
 */
export class Erc721SharedMetadata implements DetectableFeature {
  featureName = FEATURE_NFT_SHARED_METADATA.name;

  private contractWrapper: ContractWrapper<SharedMetadata>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<SharedMetadata>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Get Shared Metadata
   *
   * @remarks Get the shared metadata for the Open Edition NFTs.
   *
   * @example
   * ```javascript
   * const contract = await sdk.getContract("{{contract_address}}");
   *
   * const tx = await contract.erc721.sharedMetadata.get();
   * ```
   *
   * @returns  The shared metadata for the Open Edition NFTs.
   */
  public async get(): Promise<BasicNFTInput | undefined> {
    const metadata = await this.contractWrapper.read("sharedMetadata", []);

    if (metadata.every((value) => value === "")) {
      return undefined;
    }

    return {
      name: metadata.name,
      description: metadata.description,
      image: metadata.imageURI,
      animation_url: metadata.animationURI,
    };
  }

  /**
   * Set Shared Metadata
   *
   * @remarks Set the shared metadata for the Open Edition NFTs.
   *
   * @example
   * ```javascript
   * const metadata = {
   *  name: "My NFT",
   *  description: "This is my NFT",
   *  image: ...
   *  animation_url: ...
   * };
   *
   * const contract = await sdk.getContract("{{contract_address}}");
   *
   * const tx = await contract.erc721.sharedMetadata.set(metadata);
   * ```
   *
   * @param metadata - The metadata you want to set for the shared metadata.
   *
   * @returns  Receipt for the transaction
   */
  set = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadata: BasicNFTInput,
    ): Promise<Transaction<TransactionResult>> => {
      const parsedMetadata = BasicNFTInput.parse(metadata);
      // cleanup description
      parsedMetadata.description = this.sanitizeJSONString(
        parsedMetadata.description,
      );

      // take the input and upload image and animation if it is not a URI already
      const batch = [];

      if (isFileOrBuffer(parsedMetadata.image)) {
        batch.push(this.storage.upload(parsedMetadata.image));
      } else if (typeof parsedMetadata.image === "string") {
        batch.push(Promise.resolve(parsedMetadata.image));
      } else {
        batch.push(Promise.resolve(undefined));
      }

      if (isFileOrBuffer(parsedMetadata.animation_url)) {
        batch.push(this.storage.upload(parsedMetadata.animation_url));
      } else if (typeof parsedMetadata.animation_url === "string") {
        batch.push(Promise.resolve(parsedMetadata.animation_url));
      } else {
        batch.push(Promise.resolve(undefined));
      }
      const [imageUri, animationUri] = await Promise.all(batch);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setSharedMetadata",
        args: [
          {
            name: `${parsedMetadata.name || ""}`,
            description: parsedMetadata.description || "",
            imageURI: imageUri || "",
            animationURI: animationUri || "",
          },
        ],
      });
    },
  );

  private sanitizeJSONString(val: string | undefined | null) {
    if (!val) {
      return val;
    }
    const sanitized = JSON.stringify(val);
    return sanitized.slice(1, sanitized.length - 1);
  }
}
