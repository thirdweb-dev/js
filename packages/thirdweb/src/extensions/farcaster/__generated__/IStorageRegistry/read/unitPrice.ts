import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xe73faa2d",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "unitPrice" function on the contract.
 * @param options - The options for the unitPrice function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { unitPrice } from "thirdweb/extensions/farcaster";
 *
 * const result = await unitPrice();
 *
 * ```
 */
export async function unitPrice(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
