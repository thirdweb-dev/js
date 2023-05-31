import { Address } from "../../schema/shared/Address";
import { CurrencyValue } from "../currency";

export interface Bid {
  /**
   * The id of the auction.
   */
  auctionId: string;

  /**
   * The address of the buyer who made the offer.
   */
  bidderAddress: Address;

  /**
   * The currency contract address of the offer token.
   */
  currencyContractAddress: Address;

  /**
   * The amount of coins offered per token.
   */
  bidAmount: string;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  bidAmountCurrencyValue: CurrencyValue;
}
