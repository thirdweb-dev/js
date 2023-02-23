import { NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import { detectContractFeature } from "../../common/feature-detection";
import { getBaseUriFromBatch, uploadOrExtractURIs } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_NFT_LAZY_MINTABLE,
  FEATURE_NFT_REVEALABLE,
} from "../../constants/erc721-features";
import { UploadProgressEvent } from "../../types";
import {
  BaseClaimConditionERC721,
  BaseDelayedRevealERC721,
  BaseDropERC721,
} from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { DelayedReveal } from "./delayed-reveal";
import { Erc721 } from "./erc-721";
import { Erc721Claimable } from "./erc-721-claimable";
import { Erc721ClaimableWithConditions } from "./erc-721-claimable-with-conditions";
import { Transaction } from "./transactions";
import type { IClaimableERC721 } from "@thirdweb-dev/contracts-js";
import { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/LazyMint";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";

/**
 * Lazily mint and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.drop.claim(quantity);
 * ```
 */
export class Erc721LazyMintable implements DetectableFeature {
  featureName = FEATURE_NFT_LAZY_MINTABLE.name;

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
   * await contract.nft.drop.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * // Whenever you're ready, reveal your NFTs at any time
   * const batchId = 0; // the batch to reveal
   * await contract.erc721.revealer.reveal(batchId, "my secret password");
   * ```
   */
  public revealer: DelayedReveal<BaseDelayedRevealERC721> | undefined;

  /**
   * Claim tokens and configure claim conditions
   * @remarks Let users claim NFTs. Define who can claim NFTs in the collection, when and how many.
   * @example
   * ```javascript
   * const quantity = 10;
   * await contract.erc721.claim(quantity);
   * ```
   */
  public claimWithConditions: Erc721ClaimableWithConditions | undefined;
  public claim: Erc721Claimable | undefined;

  private contractWrapper: ContractWrapper<BaseDropERC721>;
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseDropERC721>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    this.revealer = this.detectErc721Revealable();
    this.claimWithConditions = this.detectErc721ClaimableWithConditions();
    this.claim = this.detectErc721Claimable();
  }

  /**
   * Create a batch of unique NFTs to be claimed in the future
   *
   * @remarks Create batch allows you to create a batch of many unique NFTs in one transaction.
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
   * const results = await contract.erc721.lazyMint(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   * @param options - optional upload progress callback
   */
  lazyMint = buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      const startFileNumber = await this.erc721.nextTokenIdToMint();
      const batch = await uploadOrExtractURIs(
        metadatas,
        this.storage,
        startFileNumber.toNumber(),
        options,
      );
      // ensure baseUri is the same for the entire batch
      const baseUri = getBaseUriFromBatch(batch);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          batch.length,
          baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
          ethers.utils.toUtf8Bytes(""),
        ],
        parse: (receipt) => {
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
        },
      });
    },
  );

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private detectErc721Revealable():
    | DelayedReveal<BaseDelayedRevealERC721>
    | undefined {
    if (
      detectContractFeature<BaseDelayedRevealERC721>(
        this.contractWrapper,
        "ERC721Revealable",
      )
    ) {
      return new DelayedReveal(
        this.contractWrapper,
        this.storage,
        FEATURE_NFT_REVEALABLE.name,
        () => this.erc721.nextTokenIdToMint(),
      );
    }
    return undefined;
  }

  private detectErc721ClaimableWithConditions():
    | Erc721ClaimableWithConditions
    | undefined {
    if (
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimConditionsV1",
      ) ||
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimConditionsV2",
      ) ||
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimPhasesV1",
      ) ||
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimPhasesV2",
      )
    ) {
      return new Erc721ClaimableWithConditions(
        this.erc721,
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }

  private detectErc721Claimable(): Erc721Claimable | undefined {
    if (
      detectContractFeature<IClaimableERC721>(
        this.contractWrapper,
        "ERC721ClaimCustom",
      )
    ) {
      return new Erc721Claimable(this.erc721, this.contractWrapper);
    }
    return undefined;
  }
}
