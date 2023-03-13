import { QueryAllParams } from "../../../core/schema/QueryParams";
import { AddressOrEns } from "../../schema";
import { BigNumberish } from "ethers";

/**
 * @public
 */
export interface MarketplaceFilter extends QueryAllParams {
  seller?: AddressOrEns;
  tokenContract?: AddressOrEns;
  tokenId?: BigNumberish;
  offeror?: AddressOrEns;
}
