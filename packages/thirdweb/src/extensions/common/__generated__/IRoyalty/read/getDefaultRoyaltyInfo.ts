import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xb24f2d39" as const;
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
 * Decodes the result of the getDefaultRoyaltyInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeGetDefaultRoyaltyInfoResult } from "thirdweb/extensions/common";
 * const result = decodeGetDefaultRoyaltyInfoResult("...");
 * ```
 */
export function decodeGetDefaultRoyaltyInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the getDefaultRoyaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { getDefaultRoyaltyInfo } from "thirdweb/extensions/common";
 *
 * const result = await getDefaultRoyaltyInfo();
 *
 * ```
 */
export async function getDefaultRoyaltyInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
