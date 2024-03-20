import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xeb08ab28",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "idCounter" function on the contract.
 * @param options - The options for the idCounter function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { idCounter } from "thirdweb/extensions/farcaster";
 *
 * const result = await idCounter();
 *
 * ```
 */
export async function idCounter(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
