import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
 * Checks if the `getPlatformFeeInfo` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getPlatformFeeInfo` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetPlatformFeeInfoSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isGetPlatformFeeInfoSupported(contract);
 * ```
 */
export async function isGetPlatformFeeInfoSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * const result = await getPlatformFeeInfo({
 *  contract,
 * });
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
