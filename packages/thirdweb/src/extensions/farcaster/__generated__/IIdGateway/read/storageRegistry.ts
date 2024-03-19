import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "storageRegistry" function on the contract.
 * @param options - The options for the storageRegistry function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { storageRegistry } from "thirdweb/extensions/farcaster";
 *
 * const result = await storageRegistry();
 *
 * ```
 */
export async function storageRegistry(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4ec77b45",
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
