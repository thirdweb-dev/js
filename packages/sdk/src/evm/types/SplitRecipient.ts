import { Address } from "../schema";

/**
 * The SplitRecipient type represents a recipient of some royalty, indicated by their split percentage.
 */
export interface SplitRecipient {
  /**
   * The address of the recipient
   */
  address: Address;

  /**
   * The split of the recipient as a percentage of the total amount
   *
   * I.e. If a recipient has a split of 50%, and the asset sells for 100 ETH,
   * the recipient will receive 50 ETH.
   */
  splitPercentage: number;
}
