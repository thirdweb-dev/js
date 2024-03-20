import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xc78b616c",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "totalListings" function on the contract.
 * @param options - The options for the totalListings function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { totalListings } from "thirdweb/extensions/marketplace";
 *
 * const result = await totalListings();
 *
 * ```
 */
export async function totalListings(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
