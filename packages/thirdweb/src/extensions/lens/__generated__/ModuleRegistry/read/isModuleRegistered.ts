import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isModuleRegistered" function.
 */
export type IsModuleRegisteredParams = {
  moduleAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "moduleAddress";
  }>;
};

export const FN_SELECTOR = "0x1c5ebe2f" as const;
const FN_INPUTS = [
  {
    name: "moduleAddress",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isModuleRegistered` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isModuleRegistered` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isIsModuleRegisteredSupported } from "thirdweb/extensions/lens";
 * const supported = isIsModuleRegisteredSupported(["0x..."]);
 * ```
 */
export function isIsModuleRegisteredSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isModuleRegistered" function.
 * @param options - The options for the isModuleRegistered function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsModuleRegisteredParams } from "thirdweb/extensions/lens";
 * const result = encodeIsModuleRegisteredParams({
 *  moduleAddress: ...,
 * });
 * ```
 */
export function encodeIsModuleRegisteredParams(
  options: IsModuleRegisteredParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.moduleAddress]);
}

/**
 * Encodes the "isModuleRegistered" function into a Hex string with its parameters.
 * @param options - The options for the isModuleRegistered function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsModuleRegistered } from "thirdweb/extensions/lens";
 * const result = encodeIsModuleRegistered({
 *  moduleAddress: ...,
 * });
 * ```
 */
export function encodeIsModuleRegistered(options: IsModuleRegisteredParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsModuleRegisteredParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isModuleRegistered function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeIsModuleRegisteredResult } from "thirdweb/extensions/lens";
 * const result = decodeIsModuleRegisteredResultResult("...");
 * ```
 */
export function decodeIsModuleRegisteredResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isModuleRegistered" function on the contract.
 * @param options - The options for the isModuleRegistered function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { isModuleRegistered } from "thirdweb/extensions/lens";
 *
 * const result = await isModuleRegistered({
 *  contract,
 *  moduleAddress: ...,
 * });
 *
 * ```
 */
export async function isModuleRegistered(
  options: BaseTransactionOptions<IsModuleRegisteredParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.moduleAddress],
  });
}
