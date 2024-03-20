import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xab583c1b",
  [],
  [
    {
      type: "bytes32",
    },
  ],
] as const;

/**
 * Calls the "ADD_TYPEHASH" function on the contract.
 * @param options - The options for the ADD_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { ADD_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await ADD_TYPEHASH();
 *
 * ```
 */
export async function ADD_TYPEHASH(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
