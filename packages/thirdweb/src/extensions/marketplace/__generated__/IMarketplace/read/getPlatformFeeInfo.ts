import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getPlatformFeeInfo" function on the contract.
 * @param options - The options for the getPlatformFeeInfo function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getPlatformFeeInfo } from "thirdweb/extensions/marketplace";
 *
 * const result = await getPlatformFeeInfo();
 *
 * ```
 */
export async function getPlatformFeeInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xd45573f6",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
    ],
    params: [],
  });
}
