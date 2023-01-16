import { Price } from "../currency";
import { BigNumberish } from "ethers";

/**
 * Represents a new marketplace direct listing.
 */
export interface NewDirectListingV3 {
  /**
   * The address of the asset being listed.
   */
  assetContractAddress: string;

  /**
   * The ID of the token to list.
   */
  tokenId: BigNumberish;

  /**
   * The quantity of tokens to include in the listing.
   *
   * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
   */
  quantity: BigNumberish;

  /**
   * The address of the currency to accept for the listing.
   */
  currencyContractAddress: string;

  /**
   * The price to pay per unit of NFTs listed.
   */
  pricePerToken: Price;

  /**
   * The start time of the listing.
   */
  startTimestamp: Date;

  /**
   * The end time of the listing.
   */
  endTimestamp: Date;

  /**
   * Whether the listing is reserved to be bought from a specific set of buyers.
   */
  isReservedListing: boolean;
}
