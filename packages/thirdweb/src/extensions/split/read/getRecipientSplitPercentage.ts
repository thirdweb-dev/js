import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { shares } from "../__generated__/Split/read/shares.js";
import { totalShares } from "../__generated__/Split/read/totalShares.js";

/**
 * @extension SPLIT
 */
export interface SplitRecipient {
  /**
   * The address of the recipient
   */
  address: string;

  /**
   * The split of the recipient as a percentage of the total amount
   *
   * I.e. If a recipient has a split of 50%, and the asset sells for 100 ETH,
   * the recipient will receive 50 ETH.
   */
  splitPercentage: number;
}

/**
 * Get the split percentage of a recipient
 * @param options - The options for the transaction
 * @param options.recipientAddress - The address of the recipient
 * @returns The split percentage of the recipient
 * @extension SPLIT
 * @example
 * ```ts
 * import { getRecipientSplitPercentage } from "thirdweb/extensions/split";
 *
 * const percentage = await getRecipientSplitPercentage({ recipientAddress: "0x..." });
 * ```
 */
export async function getRecipientSplitPercentage(
  options: BaseTransactionOptions<{ recipientAddress: string }>,
): Promise<SplitRecipient> {
  const { contract, recipientAddress } = options;
  const [_totalShares, walletsShares] = await Promise.all([
    totalShares({ contract }),
    shares({ account: recipientAddress, contract }),
  ]);
  // We convert to basis points to avoid floating point loss of precision
  // 7544n -> 75.44 (75.44 %)
  // also we don't have to worry about number overflow in this particular context
  const splitPercentage =
    (Number(walletsShares) * 1e7) / Number(_totalShares) / 1e5;
  return {
    address: recipientAddress,
    splitPercentage,
  };
}
