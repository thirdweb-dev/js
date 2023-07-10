import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { CurrencyValue } from "../currency";
import { BigNumber, BigNumberish } from "ethers";

export interface Offer {
  /**
   * The id of the listing.
   */
  listingId: BigNumberish;

  /**
   * The address of the buyer who made the offer.
   */
  buyerAddress: AddressOrEns;

  /**
   * The quantity of tokens to be bought.
   */
  quantityDesired: BigNumberish;

  /**
   * The amount of coins offered per token.
   */
  pricePerToken: BigNumber;

  /**
   * The `CurrencyValue` of the listing. Useful for displaying the price information.
   */
  currencyValue: CurrencyValue;

  /**
   * The currency contract address of the offer token.
   */
  currencyContractAddress: AddressOrEns;
}
