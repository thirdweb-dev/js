import { NFTMetadata } from "../../../core/schema/nft";
import { ListingType } from "../../enums/marketplace/ListingType";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { CurrencyValue } from "../currency";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Represents a new marketplace auction listing.
 */
export interface AuctionListing {
  /**
   * The id of the listing
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
  startTimeInEpochSeconds: BigNumberish;

  /**
   * Number of seconds until the auction expires.
   */
  endTimeInEpochSeconds: BigNumberish;

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
   * The reserve price is the minimum price that a bid must be in order to be accepted.
   */
  reservePrice: BigNumber;

  /**
   * The buyout price of the listing.
   */
  buyoutPrice: BigNumber;

  /**
   * The `CurrencyValue` of the buyout price listing.
   * Useful for displaying the price information.
   */
  buyoutCurrencyValuePerToken: CurrencyValue;

  /**
   * The `CurrencyValue` of the reserve price.
   * Useful for displaying the price information.
   */
  reservePriceCurrencyValuePerToken: CurrencyValue;

  /**
   * The address of the seller.
   */
  sellerAddress: AddressOrEns;

  type: ListingType.Auction;
}
