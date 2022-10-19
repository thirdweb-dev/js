import { TransactionResultWithId } from "..";
import { NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import { FEATURE_NFT_TIERED_DROP } from "../../constants/erc721-features";
import { UploadProgressEvent } from "../../types/events";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import type { LazyMintWithTier } from "@thirdweb-dev/contracts-js";

export class Erc721TieredDrop implements DetectableFeature {
  featureName = FEATURE_NFT_TIERED_DROP.name;

  private contractWrapper: ContractWrapper<LazyMintWithTier>;

  constructor(contractWrapper: ContractWrapper<LazyMintWithTier>) {
    this.contractWrapper = contractWrapper;
  }

  public async lazyMintWithTier(
    metadatas: NFTMetadataOrUri[],
    tier: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {}
}
