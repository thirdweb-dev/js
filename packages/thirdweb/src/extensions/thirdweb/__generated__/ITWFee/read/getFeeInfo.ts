import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getFeeInfo" function.
 */
export type GetFeeInfoParams = {
  proxy: AbiParameterToPrimitiveType<{ type: "address"; name: "_proxy" }>;
  type: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_type" }>;
};

export const FN_SELECTOR = "0x85b49ad0" as const;
const FN_INPUTS = [
  {
    name: "_proxy",
    type: "address",
  },
  {
    name: "_type",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "recipient",
    type: "address",
  },
  {
    name: "bps",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getFeeInfo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getFeeInfo` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetFeeInfoSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetFeeInfoSupported(["0x..."]);
 * ```
 */
export function isGetFeeInfoSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getFeeInfo" function.
 * @param options - The options for the getFeeInfo function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetFeeInfoParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetFeeInfoParams({
 *  proxy: ...,
 *  type: ...,
 * });
 * ```
 */
export function encodeGetFeeInfoParams(options: GetFeeInfoParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proxy, options.type]);
}

/**
 * Encodes the "getFeeInfo" function into a Hex string with its parameters.
 * @param options - The options for the getFeeInfo function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetFeeInfo } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetFeeInfo({
 *  proxy: ...,
 *  type: ...,
 * });
 * ```
 */
export function encodeGetFeeInfo(options: GetFeeInfoParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetFeeInfoParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getFeeInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetFeeInfoResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetFeeInfoResultResult("...");
 * ```
 */
export function decodeGetFeeInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getFeeInfo" function on the contract.
 * @param options - The options for the getFeeInfo function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getFeeInfo } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getFeeInfo({
 *  contract,
 *  proxy: ...,
 *  type: ...,
 * });
 *
 * ```
 */
export async function getFeeInfo(
  options: BaseTransactionOptions<GetFeeInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.proxy, options.type],
  });
}
