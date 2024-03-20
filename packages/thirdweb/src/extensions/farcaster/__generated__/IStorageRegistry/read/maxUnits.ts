import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x06517a29",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "maxUnits" function on the contract.
 * @param options - The options for the maxUnits function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { maxUnits } from "thirdweb/extensions/farcaster";
 *
 * const result = await maxUnits();
 *
 * ```
 */
export async function maxUnits(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
