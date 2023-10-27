import { NFTMetadata } from "../../../core/schema/nft";
import { ListingType } from "../../enums/marketplace/ListingType";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { CurrencyValue } from "../currency";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Represents a marketplace direct listing.
 */
export interface DirectListing {
  /**
   * The id of the listing.
   */
  id: string;

  /**
   * The address of the asset being listed.
   */
  assetContractAddress: AddressOrEns;

  /**
   * The ID of the token to list.
   */
  tokenId: BigNumberish;

  /**
   * The asset being listed.
   */
  asset: NFTMetadata;

  /**
   * The start time of the listing.
   */
  startTimeInSeconds: BigNumberish;

  /**
   * Number of seconds until the listing expires.
   */
  secondsUntilEnd: BigNumberish;

  /**
   * The quantity of tokens to include in the listing.
   *
   * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
   */
  quantity: BigNumberish;

  /**
   * The address of the currency to accept for the listing.
   */
  currencyContractAddress: AddressOrEns;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  buyoutCurrencyValuePerToken: CurrencyValue;

  /**
   * The buyout price of the listing.
   */
  buyoutPrice: BigNumber;

  /**
   * The address of the seller.
   */
  sellerAddress: AddressOrEns;

  type: ListingType.Direct;
}
