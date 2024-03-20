import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "maxKeysPerFid" function on the contract.
 * @param options - The options for the maxKeysPerFid function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { maxKeysPerFid } from "thirdweb/extensions/farcaster";
 *
 * const result = await maxKeysPerFid();
 *
 * ```
 */
export async function maxKeysPerFid(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe33acf38",
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
