import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { decimals as generatedDecimals } from "../__generated__/IERC20/read/decimals.js";

/**
 * Retrieves the number of decimal places for a given ERC20 contract.
 * @param options - The options for the transaction.
 * @returns A promise that resolves to the number of decimal places.
 * @extension ERC20
 * @example
 * ```ts
 * import { decimals } from "thirdweb/extensions/erc20";
 *
 * const tokenDecimals = await decimals({ contract });
 * ```
 */
export async function decimals(
  options: BaseTransactionOptions,
): Promise<number> {
  return withCache(() => generatedDecimals(options), {
    cacheKey: `${options.contract.chain.id}:${options.contract.address}:decimals`,
    // can never change, so cache forever
    cacheTime: Number.POSITIVE_INFINITY,
  });
}
