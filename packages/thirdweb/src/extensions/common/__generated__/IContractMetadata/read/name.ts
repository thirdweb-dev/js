import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x06fdde03",
  [],
  [
    {
      type: "string",
    },
  ],
] as const;

/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { name } from "thirdweb/extensions/common";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
