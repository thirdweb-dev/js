import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xd45573f6",
  [],
  [
    {
      type: "address",
    },
    {
      type: "uint16",
    },
  ],
] as const;

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
    method: METHOD,
    params: [],
  });
}
