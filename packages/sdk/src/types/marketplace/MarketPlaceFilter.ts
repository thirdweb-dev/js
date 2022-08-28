import { QueryAllParams } from "../QueryParams";
import { BigNumberish } from "ethers";

/**
 * @public
 */
export interface MarketplaceFilter extends QueryAllParams {
  seller?: string;
  tokenContract?: string;
  tokenId?: BigNumberish;
}
