import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "idRegistry" function on the contract.
 * @param options - The options for the idRegistry function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { idRegistry } from "thirdweb/extensions/farcaster";
 *
 * const result = await idRegistry();
 *
 * ```
 */
export async function idRegistry(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x0aa13b8c",
      [],
      [
        {
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
