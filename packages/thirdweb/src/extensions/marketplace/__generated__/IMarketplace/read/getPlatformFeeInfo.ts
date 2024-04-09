import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xd45573f6" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
  {
    type: "uint16",
  },
] as const;

/**
 * Decodes the result of the getPlatformFeeInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetPlatformFeeInfoResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetPlatformFeeInfoResult("...");
 * ```
 */
export function decodeGetPlatformFeeInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getPlatformFeeInfo" function on the contract.
 * @param options - The options for the getPlatformFeeInfo function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getPlatformFeeInfo } from "thirdweb/extensions/marketplace";
 *
 * const result = await getPlatformFeeInfo();
 *
 * ```
 */
export async function getPlatformFeeInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
