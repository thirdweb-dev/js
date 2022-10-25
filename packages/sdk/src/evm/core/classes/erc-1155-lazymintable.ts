import { NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import {
  detectContractFeature,
  hasFunction,
} from "../../common/feature-detection";
import { getPrebuiltInfo } from "../../common/legacy";
import { uploadOrExtractURIs } from "../../common/nft";
import {
  FEATURE_EDITION_LAZY_MINTABLE,
  FEATURE_EDITION_REVEALABLE,
} from "../../constants/erc1155-features";
import {
  BaseClaimConditionERC1155,
  BaseDelayedRevealERC1155,
  BaseDropERC1155,
} from "../../types/eips";
import { UploadProgressEvent } from "../../types/events";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { DelayedReveal } from "./delayed-reveal";
import { Erc1155 } from "./erc-1155";
import { ERC1155Claimable } from "./erc-1155-claimable";
import { Erc1155ClaimableWithConditions } from "./erc-1155-claimable-with-conditions";
import type { IClaimableERC1155 } from "@thirdweb-dev/contracts-js";
import { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/LazyMint";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";

export class Erc1155LazyMintable implements DetectableFeature {
  featureName = FEATURE_EDITION_LAZY_MINTABLE.name;

  /**
   * Delayed reveal
   * @remarks Create a batch of encrypted NFTs that can be revealed at a later time.
   * @example
   * ```javascript
   * // the real NFTs, these will be encrypted until you reveal them
   * const realNFTs = [{
   *   name: "Common NFT #1",
   *   description: "Common NFT, one of many.",
   *   image: fs.readFileSync("path/to/image.png"),
   * }, {
   *   name: "Super Rare NFT #2",
   *   description: "You got a Super Rare NFT!",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   * // A placeholder NFT that people will get immediately in their wallet, and will be converted to the real NFT at reveal time
   * const placeholderNFT = {
   *   name: "Hidden NFT",
   *   description: "Will be revealed next week!"
   * };
   * // Create and encrypt the NFTs
   * await contract.edition.drop.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * // Whenever you're ready, reveal your NFTs at any time
   * const batchId = 0; // the batch to reveal
   * await contract.edition.drop.revealer.reveal(batchId, "my secret password");
   * ```
   */
  public revealer: DelayedReveal<BaseDelayedRevealERC1155> | undefined;

  /**
   * Claim tokens and configure claim conditions
   * @remarks Let users claim NFTs. Define who can claim NFTs in the collection, when and how many.
   * @example
   * ```javascript
   * const quantity = 10;
   * const tokenId = 0;
   * await contract.erc1155.claimTo("0x...", 0, quantity);
   * ```
   */
  public claimWithConditions: Erc1155ClaimableWithConditions | undefined;
  public claim: ERC1155Claimable | undefined;

  private contractWrapper: ContractWrapper<BaseDropERC1155>;
  private erc1155: Erc1155;
  private storage: ThirdwebStorage;

  constructor(
    erc1155: Erc1155,
    contractWrapper: ContractWrapper<BaseDropERC1155>,
    storage: ThirdwebStorage,
  ) {
    this.erc1155 = erc1155;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    this.claim = this.detectErc1155Claimable();
    this.claimWithConditions = this.detectErc1155ClaimableWithConditions();
    this.revealer = this.detectErc721Revealable();
  }

  /**
   * Create a batch of NFTs to be claimed in the future
   *
   * @remarks Create batch allows you to create a batch of many NFTs in one transaction.
   *
   * @example
   * ```javascript
   * // Custom metadata of the NFTs to create
   * const metadatas = [{
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   *
   * const results = await contract.erc1155.lazyMint(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   * @param options - optional upload progress callback
   */
  public async lazyMint(
    metadatas: NFTMetadataOrUri[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {
    const startFileNumber = await this.erc1155.nextTokenIdToMint();
    const batch = await uploadOrExtractURIs(
      metadatas,
      this.storage,
      startFileNumber.toNumber(),
      options,
    );
    // ensure baseUri is the same for the entire batch
    const baseUri = batch[0].substring(0, batch[0].lastIndexOf("/"));
    for (let i = 0; i < batch.length; i++) {
      const uri = batch[i].substring(0, batch[i].lastIndexOf("/"));
      if (baseUri !== uri) {
        throw new Error(
          `Can only create batches with the same base URI for every entry in the batch. Expected '${baseUri}' but got '${uri}'`,
        );
      }
    }
    const isLegacyEditionDropContract =
      await this.isLegacyEditionDropContract();
    let receipt;
    if (isLegacyEditionDropContract) {
      receipt = await this.contractWrapper.sendTransaction("lazyMint", [
        batch.length,
        `${baseUri.endsWith("/") ? baseUri : `${baseUri}/`}`,
      ]);
    } else {
      // new contracts/extensions have support for delayed reveal that adds an extra parameter to lazyMint
      receipt = await this.contractWrapper.sendTransaction("lazyMint", [
        batch.length,
        `${baseUri.endsWith("/") ? baseUri : `${baseUri}/`}`,
        ethers.utils.toUtf8Bytes(""),
      ]);
    }
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
        data: () => this.erc1155.getTokenMetadata(id),
      });
    }
    return results;
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private detectErc1155Claimable(): ERC1155Claimable | undefined {
    if (
      detectContractFeature<IClaimableERC1155>(
        this.contractWrapper,
        "ERC1155Claimable",
      ) &&
      !hasFunction("setClaimConditions", this.contractWrapper)
    ) {
      return new ERC1155Claimable(this.contractWrapper);
    }
    return undefined;
  }

  private detectErc1155ClaimableWithConditions():
    | Erc1155ClaimableWithConditions
    | undefined {
    if (
      detectContractFeature<BaseClaimConditionERC1155>(
        this.contractWrapper,
        "ERC1155ClaimableWithConditions",
      )
    ) {
      return new Erc1155ClaimableWithConditions(
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }

  private detectErc721Revealable():
    | DelayedReveal<BaseDelayedRevealERC1155>
    | undefined {
    if (
      detectContractFeature<BaseDelayedRevealERC1155>(
        this.contractWrapper,
        "ERC1155Revealable",
      )
    ) {
      return new DelayedReveal(
        this.contractWrapper,
        this.storage,
        FEATURE_EDITION_REVEALABLE.name,
        () => this.erc1155.nextTokenIdToMint(),
      );
    }
    return undefined;
  }

  private async isLegacyEditionDropContract() {
    const info = await getPrebuiltInfo(
      this.contractWrapper.readContract.address,
      this.contractWrapper.getProvider(),
    );
    return info.type === "DropERC1155" && info.version <= 2;
  }
}
