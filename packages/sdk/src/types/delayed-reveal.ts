import { BigNumber } from "ethers";
import { NFTMetadata } from "../schema/tokens/common";

export interface BatchToReveal {
  batchId: BigNumber;
  batchUri: string;
  placeholderMetadata: NFTMetadata;
}
