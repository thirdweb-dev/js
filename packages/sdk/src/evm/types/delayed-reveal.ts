import { NFTMetadata } from "../../core/schema/nft";
import { BigNumber } from "ethers";

export interface BatchToReveal {
  batchId: BigNumber;
  batchUri: string;
  placeholderMetadata: NFTMetadata;
}
