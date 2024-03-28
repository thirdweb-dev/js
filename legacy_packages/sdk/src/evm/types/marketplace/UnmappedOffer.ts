import { BigNumberish } from "ethers";

export interface UnmappedOffer {
  /**
   * The quantity of tokens to be bought.
   */
  quantityDesired?: BigNumberish;

  /**
   * The amount of coins offered per token.
   */
  pricePerToken: BigNumberish;

  /**
   * The currency contract address of the offer token.
   */
  currency: string;

  /**
   * The user who is making the offer.
   */
  offeror: string;

  /**
   * The amount of tokens desired.
   */
  quantityWanted: BigNumberish;

  /**
   * The listing that the offer was made on
   */
  listingId?: BigNumberish;

  /**
   * The time where the offer expires
   */
  expirationTimestamp?: BigNumberish;
}
