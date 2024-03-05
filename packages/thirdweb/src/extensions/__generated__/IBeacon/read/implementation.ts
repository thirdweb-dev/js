import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the implementation function on the contract.
 * @param options - The options for the implementation function.
 * @returns The parsed result of the function call.
 * @extension IBEACON
 * @example
 * ```
 * import { implementation } from "thirdweb/extensions/IBeacon";
 *
 * const result = await implementation();
 *
 * ```
 */
export async function implementation(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x5c60da1b",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
