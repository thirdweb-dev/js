import type { DropERC1155_V2 } from "@thirdweb-dev/contracts-js";
import { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/LazyMint";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { utils, type providers } from "ethers";
import { NFTMetadata, NFTMetadataOrUri } from "../../../../../core/schema/nft";
import { detectContractFeature } from "../../../../common/feature-detection/detectContractFeature";
import { getPrebuiltInfo } from "../../../../common/legacy";
import { uploadOrExtractURIs } from "../../../../common/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import {
  FEATURE_EDITION_LAZY_MINTABLE_V2,
  FEATURE_EDITION_REVEALABLE,
} from "../../../../constants/erc1155-features";
import {
  BaseDelayedRevealERC1155,
  BaseDropERC1155,
} from "../../../../types/eips";
import type { UploadProgressEvent } from "../../../../types/events";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { TransactionResultWithId } from "../../../types";
import { ContractWrapper } from "../contract-wrapper";
import { DelayedReveal } from "../../delayed-reveal";
import type { Erc1155 } from "../../erc-1155";
import { Transaction } from "../../transactions";

export class Erc1155LazyMintable implements DetectableFeature {
  featureName = FEATURE_EDITION_LAZY_MINTABLE_V2.name;

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
    this.revealer = this.detectErc1155Revealable();
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
  lazyMint = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
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

      const parse = (receipt: providers.TransactionReceipt) => {
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
      };

      const prebuiltInfo = await getPrebuiltInfo(
        this.contractWrapper.address,
        this.contractWrapper.getProvider(),
      );
      if (
        this.isLegacyEditionDropContract(this.contractWrapper, prebuiltInfo)
      ) {
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "lazyMint",
          args: [
            batch.length,
            `${baseUri.endsWith("/") ? baseUri : `${baseUri}/`}`,
          ],
          parse,
        });
      } else {
        // new contracts/extensions have support for delayed reveal that adds an extra parameter to lazyMint
        return Transaction.fromContractWrapper({
          contractWrapper: this.contractWrapper,
          method: "lazyMint",
          args: [
            batch.length,
            `${baseUri.endsWith("/") ? baseUri : `${baseUri}/`}`,
            utils.toUtf8Bytes(""),
          ],
          parse,
        });
      }
    },
  );

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/
  private detectErc1155Revealable():
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

  private isLegacyEditionDropContract(
    contractWrapper: ContractWrapper<any>,
    info: Awaited<ReturnType<typeof getPrebuiltInfo>>,
  ): contractWrapper is ContractWrapper<DropERC1155_V2> {
    return (info && info.type === "DropERC1155" && info.version < 3) || false;
  }
}
