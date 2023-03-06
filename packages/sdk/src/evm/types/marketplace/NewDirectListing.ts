import { AddressOrEns } from "../../schema";
import { Price } from "../currency";
import { BigNumberish } from "ethers";

/**
 * Represents a new marketplace direct listing.
 */
export interface NewDirectListing {
  type?: "NewDirectListing";

  /**
   * The address of the asset being listed.
   */
  assetContractAddress: AddressOrEns;

  /**
   * The ID of the token to list.
   */
  tokenId: BigNumberish;

  /**
   * The start time of the listing.
   */
  startTimestamp: Date;

  /**
   * The duration of the listing in seconds.
   */
  listingDurationInSeconds: BigNumberish;

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
   * The buyout price of the listing.
   *
   * So if the `quantity = 10` and the `reserve price = 1`, then the buyout price
   * is 10 coins (of the configured currency).
   */
  buyoutPricePerToken: Price;
}
