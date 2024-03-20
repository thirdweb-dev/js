import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xcb2ef6f7",
  [],
  [
    {
      type: "bytes32",
    },
  ],
] as const;

/**
 * Calls the "contractType" function on the contract.
 * @param options - The options for the contractType function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { contractType } from "thirdweb/extensions/marketplace";
 *
 * const result = await contractType();
 *
 * ```
 */
export async function contractType(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
