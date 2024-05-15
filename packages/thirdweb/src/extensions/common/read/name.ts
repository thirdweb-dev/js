import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { withCache } from "../../../utils/promise/withCache.js";
import { name as generatedName } from "../__generated__/IContractMetadata/read/name.js";

/**
 * Retrieves the name associated with the given contract.
 * @param options - The options for the transaction.
 * @returns A promise that resolves to the name associated with the contract.
 * @extension COMMON
 * @example
 * ```ts
 * import { name } from "thirdweb/extensions/common";
 *
 * const contractName = await name({ contract });
 * ```
 */
export async function name(options: BaseTransactionOptions): Promise<string> {
  return withCache(() => generatedName(options), {
    cacheKey: `${options.contract.chain.id}:${options.contract.address}:name`,
    // can never change, so cache forever
    cacheTime: Number.POSITIVE_INFINITY,
  });
}
