import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "deprecationTimestamp" function on the contract.
 * @param options - The options for the deprecationTimestamp function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { deprecationTimestamp } from "thirdweb/extensions/farcaster";
 *
 * const result = await deprecationTimestamp();
 *
 * ```
 */
export async function deprecationTimestamp(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x2c39d670",
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
