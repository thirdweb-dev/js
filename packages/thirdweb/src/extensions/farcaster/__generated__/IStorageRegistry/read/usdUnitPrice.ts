import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "usdUnitPrice" function on the contract.
 * @param options - The options for the usdUnitPrice function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { usdUnitPrice } from "thirdweb/extensions/farcaster";
 *
 * const result = await usdUnitPrice();
 *
 * ```
 */
export async function usdUnitPrice(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x40df0ba0",
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
