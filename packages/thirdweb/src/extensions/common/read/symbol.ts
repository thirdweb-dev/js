import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { symbol as generatedSymbol } from "../__generated__/IContractMetadata/read/symbol.js";

/**
 * Retrieves the name associated with the given contract.
 * @param options - The options for the transaction.
 * @returns A promise that resolves to the name associated with the contract.
 * @extension COMMON
 * @example
 * ```ts
 * import { symbol } from "thirdweb/extensions/common";
 *
 * const contractSymbol = await symbol({ contract });
 * ```
 */
export async function symbol(options: BaseTransactionOptions): Promise<string> {
  return withCache(() => generatedSymbol(options), {
    cacheKey: `${options.contract.chain.id}:${options.contract.address}:symbol`,
    // can never change, so cache forever
    cacheTime: Number.POSITIVE_INFINITY,
  });
}
