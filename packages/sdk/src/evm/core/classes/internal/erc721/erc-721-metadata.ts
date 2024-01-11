import { NFTMetadataOrUri } from "../../../../../core/schema/nft";
import { uploadOrExtractURI } from "../../../../common/nft";
import { buildTransactionFunction } from "../../../../common/transactions";
import { FEATURE_NFT_UPDATABLE_METADATA } from "../../../../constants/erc721-features";
import { DetectableFeature } from "../../../interfaces/DetectableFeature";
import { ContractWrapper } from "../contract-wrapper";
import { Transaction } from "../../transactions";
import type { INFTMetadata } from "@thirdweb-dev/contracts-js";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumberish } from "ethers";

export class Erc721UpdatableMetadata implements DetectableFeature {
  featureName = FEATURE_NFT_UPDATABLE_METADATA.name;

  private contractWrapper: ContractWrapper<INFTMetadata>;
  private storage: ThirdwebStorage;

  constructor(
    contractWrapper: ContractWrapper<INFTMetadata>,
    storage: ThirdwebStorage,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  /**
   * Update the metadata of an NFT
   *
   * @remarks Update the metadata of an NFT
   *
   * @example
   * ```javascript
   * // The token ID of the NFT whose metadata you want to update
   * const tokenId = 0;
   * // The new metadata
   * const metadata = { name: "My NFT", description: "My NFT description" }
   *
   * await contract.nft.metadata.update(tokenId, metadata);
   * ```
   */
  update = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish, metadata: NFTMetadataOrUri) => {
      const uri = await uploadOrExtractURI(metadata, this.storage);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setTokenURI",
        args: [tokenId, uri],
      });
    },
  );
}
