import { NFTMetadata } from "../schema/tokens/common";
import { BigNumber } from "ethers";

export interface BatchToReveal {
  batchId: BigNumber;
  batchUri: string;
  placeholderMetadata: NFTMetadata;
}
