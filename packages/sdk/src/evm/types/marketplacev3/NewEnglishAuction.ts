import { Price } from "../currency";
import { BigNumberish } from "ethers";

/**
 * Represents a new marketplace auction.
 */
export interface NewEnglishAuction {
  type?: "NewAuctionListing";

  /**
   * The address of the asset being auctioned.
   */
  assetContractAddress: string;

  /**
   * The ID of the token to auction.
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
   * The minimum price that a bid must be in order to be accepted.
   */
  minimumBidAmount: Price;

  /**
   * The buyout price of the auction.
   */
  buyoutBidAmount: Price;

  /**
   * This is a buffer e.g. x seconds.
   *
   * If a new winning bid is made less than x seconds before expirationTimestamp, the
   * expirationTimestamp is increased by x seconds.
   */
  timeBufferInSeconds: BigNumberish;

  /**
   * This is a buffer in basis points e.g. x%.
   *
   * To be considered as a new winning bid, a bid must be at least x% greater than
   * the current winning bid.
   */
  bidBufferBps: BigNumberish;

  /**
   * The start time of the auction.
   */
  startTimestamp: Date;

  /**
   * The end time of the auction.
   */
  endTimestamp: Date;
}
