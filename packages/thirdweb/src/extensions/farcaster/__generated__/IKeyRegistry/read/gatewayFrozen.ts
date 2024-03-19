import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "gatewayFrozen" function on the contract.
 * @param options - The options for the gatewayFrozen function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { gatewayFrozen } from "thirdweb/extensions/farcaster";
 *
 * const result = await gatewayFrozen();
 *
 * ```
 */
export async function gatewayFrozen(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x95e7549f",
      [],
      [
        {
          type: "bool",
        },
      ],
    ],
    params: [],
  });
}
