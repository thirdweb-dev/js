import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "keyRegistry" function on the contract.
 * @param options - The options for the keyRegistry function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { keyRegistry } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyRegistry();
 *
 * ```
 */
export async function keyRegistry(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x086b5198",
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
