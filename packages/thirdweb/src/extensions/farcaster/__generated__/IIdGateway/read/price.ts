import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "price" function on the contract.
 * @param options - The options for the price function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { price } from "thirdweb/extensions/farcaster";
 *
 * const result = await price();
 *
 * ```
 */
export async function price(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa035b1fe",
      [],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
