import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRewardLocker" function.
 */
export type GetRewardLockerParams = {
  adapterType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "adapterType";
  }>;
};

export const FN_SELECTOR = "0x16e23696" as const;
const FN_INPUTS = [
  {
    type: "uint8",
    name: "adapterType",
  },
] as const;
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
 * Encodes the parameters for the "getRewardLocker" function.
 * @param options - The options for the getRewardLocker function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetRewardLockerParams } from "thirdweb/extensions/tokens";
 * const result = encodeGetRewardLockerParams({
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeGetRewardLockerParams(options: GetRewardLockerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.adapterType]);
}

/**
 * Encodes the "getRewardLocker" function into a Hex string with its parameters.
 * @param options - The options for the getRewardLocker function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetRewardLocker } from "thirdweb/extensions/tokens";
 * const result = encodeGetRewardLocker({
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeGetRewardLocker(options: GetRewardLockerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRewardLockerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
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
 *  adapterType: ...,
 * });
 *
 * ```
 */
export async function getRewardLocker(
  options: BaseTransactionOptions<GetRewardLockerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.adapterType],
  });
}
