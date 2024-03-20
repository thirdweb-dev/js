import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xb5775561",
  [],
  [
    {
      type: "bytes32",
    },
  ],
] as const;

/**
 * Calls the "REMOVE_TYPEHASH" function on the contract.
 * @param options - The options for the REMOVE_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { REMOVE_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await REMOVE_TYPEHASH();
 *
 * ```
 */
export async function REMOVE_TYPEHASH(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
