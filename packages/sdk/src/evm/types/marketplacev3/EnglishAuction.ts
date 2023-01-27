import { NFTMetadata } from "../../../core/schema/nft";
import { CurrencyValue } from "../currency";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Represents a new marketplace english-auction.
 */
export interface EnglishAuction {
  /**
   * The id of the auction
   */
  id: string;

  /**
   * The address of the creator of auction.
   */
  creatorAddress: string;

  /**
   * The address of the asset being auctioned.
   */
  assetContractAddress: string;

  /**
   * The ID of the token to auction.
   */
  tokenId: BigNumberish;

  /**
   * The quantity of tokens to include in the auction.
   *
   * For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
   */
  quantity: BigNumberish;

  /**
   * The address of the currency to accept for the auction.
   */
  currencyContractAddress: string;

  /**
   * The minimum price that a bid must be in order to be accepted.
   */
  minimumBidAmount: BigNumber;

  /**
   * The `CurrencyValue` of the minimum bid amount.
   * Useful for displaying the price information.
   */
  minimumBidCurrencyValue: CurrencyValue;

  /**
   * The buyout price of the auction.
   */
  buyoutBidAmount: BigNumber;

  /**
   * The `CurrencyValue` of the buyout price.
   * Useful for displaying the price information.
   */
  buyoutCurrencyValue: CurrencyValue;

  /**
   * This is a buffer e.g. x seconds.
   *
   * If a new winning bid is made less than x seconds before expirationTimestamp, the
   * expirationTimestamp is increased by x seconds.
   */
  timeBufferInSeconds: BigNumber;

  /**
   * This is a buffer in basis points e.g. x%.
   *
   * To be considered as a new winning bid, a bid must be at least x% greater than
   * the current winning bid.
   */
  bidBufferBps: BigNumber;

  /**
   * The start time of the auction.
   */
  startTimeInSeconds: BigNumberish;

  /**
   * The end time of the auction.
   */
  endTimeInSeconds: BigNumberish;

  /**
   * The asset being auctioned.
   */
  asset: NFTMetadata;
}
