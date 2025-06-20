import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getModuleTypes" function.
 */
export type GetModuleTypesParams = {
  moduleAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "moduleAddress";
  }>;
};

export const FN_SELECTOR = "0xc5dcd896" as const;
const FN_INPUTS = [
  {
    name: "moduleAddress",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getModuleTypes` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getModuleTypes` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetModuleTypesSupported } from "thirdweb/extensions/lens";
 * const supported = isGetModuleTypesSupported(["0x..."]);
 * ```
 */
export function isGetModuleTypesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getModuleTypes" function.
 * @param options - The options for the getModuleTypes function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetModuleTypesParams } from "thirdweb/extensions/lens";
 * const result = encodeGetModuleTypesParams({
 *  moduleAddress: ...,
 * });
 * ```
 */
export function encodeGetModuleTypesParams(options: GetModuleTypesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.moduleAddress]);
}

/**
 * Encodes the "getModuleTypes" function into a Hex string with its parameters.
 * @param options - The options for the getModuleTypes function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetModuleTypes } from "thirdweb/extensions/lens";
 * const result = encodeGetModuleTypes({
 *  moduleAddress: ...,
 * });
 * ```
 */
export function encodeGetModuleTypes(options: GetModuleTypesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetModuleTypesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getModuleTypes function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetModuleTypesResult } from "thirdweb/extensions/lens";
 * const result = decodeGetModuleTypesResultResult("...");
 * ```
 */
export function decodeGetModuleTypesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getModuleTypes" function on the contract.
 * @param options - The options for the getModuleTypes function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getModuleTypes } from "thirdweb/extensions/lens";
 *
 * const result = await getModuleTypes({
 *  contract,
 *  moduleAddress: ...,
 * });
 *
 * ```
 */
export async function getModuleTypes(
  options: BaseTransactionOptions<GetModuleTypesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.moduleAddress],
  });
}
