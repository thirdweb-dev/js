import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the getDefaultRoyaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```
 * import { getDefaultRoyaltyInfo } from "thirdweb/extensions/common";
 *
 * const result = await getDefaultRoyaltyInfo();
 *
 * ```
 */
export async function getDefaultRoyaltyInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xb24f2d39",
      [],
      [
        {
          type: "address",
        },
        {
          type: "uint16",
        },
      ],
    ],
    params: [],
  });
}
