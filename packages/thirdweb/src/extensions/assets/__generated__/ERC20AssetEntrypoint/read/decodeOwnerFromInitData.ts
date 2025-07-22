import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "decodeOwnerFromInitData" function.
 */
export type DecodeOwnerFromInitDataParams = {
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0xb4d9e9c2" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "owner",
  },
] as const;

/**
 * Checks if the `decodeOwnerFromInitData` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `decodeOwnerFromInitData` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isDecodeOwnerFromInitDataSupported } from "thirdweb/extensions/assets";
 * const supported = isDecodeOwnerFromInitDataSupported(["0x..."]);
 * ```
 */
export function isDecodeOwnerFromInitDataSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "decodeOwnerFromInitData" function.
 * @param options - The options for the decodeOwnerFromInitData function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeDecodeOwnerFromInitDataParams } from "thirdweb/extensions/assets";
 * const result = encodeDecodeOwnerFromInitDataParams({
 *  data: ...,
 * });
 * ```
 */
export function encodeDecodeOwnerFromInitDataParams(
  options: DecodeOwnerFromInitDataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.data]);
}

/**
 * Encodes the "decodeOwnerFromInitData" function into a Hex string with its parameters.
 * @param options - The options for the decodeOwnerFromInitData function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeDecodeOwnerFromInitData } from "thirdweb/extensions/assets";
 * const result = encodeDecodeOwnerFromInitData({
 *  data: ...,
 * });
 * ```
 */
export function encodeDecodeOwnerFromInitData(
  options: DecodeOwnerFromInitDataParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDecodeOwnerFromInitDataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the decodeOwnerFromInitData function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodeDecodeOwnerFromInitDataResult } from "thirdweb/extensions/assets";
 * const result = decodeDecodeOwnerFromInitDataResultResult("...");
 * ```
 */
export function decodeDecodeOwnerFromInitDataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "decodeOwnerFromInitData" function on the contract.
 * @param options - The options for the decodeOwnerFromInitData function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodeOwnerFromInitData } from "thirdweb/extensions/assets";
 *
 * const result = await decodeOwnerFromInitData({
 *  contract,
 *  data: ...,
 * });
 *
 * ```
 */
export async function decodeOwnerFromInitData(
  options: BaseTransactionOptions<DecodeOwnerFromInitDataParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.data],
  });
}
