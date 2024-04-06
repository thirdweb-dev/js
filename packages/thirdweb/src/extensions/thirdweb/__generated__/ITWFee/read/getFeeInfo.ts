import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "address",
    name: "_proxy",
  },
  {
    type: "uint256",
    name: "_type",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "recipient",
  },
  {
    type: "uint256",
    name: "bps",
  },
] as const;

/**
 * Encodes the parameters for the "getFeeInfo" function.
 * @param options - The options for the getFeeInfo function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetFeeInfoParams } "thirdweb/extensions/thirdweb";
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
 * Decodes the result of the getFeeInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetFeeInfoResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetFeeInfoResult("...");
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
