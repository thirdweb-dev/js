import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xb0188df2" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "rewardLocker",
  },
] as const;

/**
 * Checks if the `getRewardLocker` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRewardLocker` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetRewardLockerSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetRewardLockerSupported(["0x..."]);
 * ```
 */
export function isGetRewardLockerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getRewardLocker function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetRewardLockerResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetRewardLockerResultResult("...");
 * ```
 */
export function decodeGetRewardLockerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRewardLocker" function on the contract.
 * @param options - The options for the getRewardLocker function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getRewardLocker } from "thirdweb/extensions/tokens";
 *
 * const result = await getRewardLocker({
 *  contract,
 * });
 *
 * ```
 */
export async function getRewardLocker(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
