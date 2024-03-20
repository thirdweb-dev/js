import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x2751c4fd",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "rentedUnits" function on the contract.
 * @param options - The options for the rentedUnits function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { rentedUnits } from "thirdweb/extensions/farcaster";
 *
 * const result = await rentedUnits();
 *
 * ```
 */
export async function rentedUnits(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
