import { QueryAllParams } from "../../../core/schema/QueryParams";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
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

/**
 * English auctions and Direct Listings V3 cannot be retrieved by offeror.
 */
export interface MarketplaceFilterWithoutOfferor
  extends Omit<MarketplaceFilter, "offeror"> {}

/**
 * Offers V3 cannot be retrieved by seller.
 */
export interface MarketplaceFilterWithoutSeller
  extends Omit<MarketplaceFilter, "seller"> {}
