import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x95d89b41",
  [],
  [
    {
      type: "string",
    },
  ],
] as const;

/**
 * Calls the "symbol" function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { symbol } from "thirdweb/extensions/common";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
