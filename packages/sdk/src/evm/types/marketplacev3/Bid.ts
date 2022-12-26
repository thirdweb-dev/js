import { CurrencyValue } from "../currency";
import { BigNumber, BigNumberish } from "ethers";

export interface Bid {
  /**
   * The id of the auction.
   */
  auctionId: BigNumberish;

  /**
   * The address of the buyer who made the offer.
   */
  bidderAddress: string;

  /**
   * The currency contract address of the offer token.
   */
  currencyContractAddress: string;

  /**
   * The amount of coins offered per token.
   */
  bidAmount: BigNumber;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  bidAmountCurrencyValue: CurrencyValue;
}
