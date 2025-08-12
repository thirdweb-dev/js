import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isModuleRegisteredAs" function.
 */
export type IsModuleRegisteredAsParams = {
  moduleAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "moduleAddress";
  }>;
  moduleType: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "moduleType";
  }>;
};

export const FN_SELECTOR = "0xc2b62fdd" as const;
const FN_INPUTS = [
  {
    name: "moduleAddress",
    type: "address",
  },
  {
    name: "moduleType",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isModuleRegisteredAs` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isModuleRegisteredAs` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isIsModuleRegisteredAsSupported } from "thirdweb/extensions/lens";
 * const supported = isIsModuleRegisteredAsSupported(["0x..."]);
 * ```
 */
export function isIsModuleRegisteredAsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isModuleRegisteredAs" function.
 * @param options - The options for the isModuleRegisteredAs function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsModuleRegisteredAsParams } from "thirdweb/extensions/lens";
 * const result = encodeIsModuleRegisteredAsParams({
 *  moduleAddress: ...,
 *  moduleType: ...,
 * });
 * ```
 */
export function encodeIsModuleRegisteredAsParams(
  options: IsModuleRegisteredAsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.moduleAddress,
    options.moduleType,
  ]);
}

/**
 * Encodes the "isModuleRegisteredAs" function into a Hex string with its parameters.
 * @param options - The options for the isModuleRegisteredAs function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsModuleRegisteredAs } from "thirdweb/extensions/lens";
 * const result = encodeIsModuleRegisteredAs({
 *  moduleAddress: ...,
 *  moduleType: ...,
 * });
 * ```
 */
export function encodeIsModuleRegisteredAs(
  options: IsModuleRegisteredAsParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsModuleRegisteredAsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isModuleRegisteredAs function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeIsModuleRegisteredAsResult } from "thirdweb/extensions/lens";
 * const result = decodeIsModuleRegisteredAsResultResult("...");
 * ```
 */
export function decodeIsModuleRegisteredAsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isModuleRegisteredAs" function on the contract.
 * @param options - The options for the isModuleRegisteredAs function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { isModuleRegisteredAs } from "thirdweb/extensions/lens";
 *
 * const result = await isModuleRegisteredAs({
 *  contract,
 *  moduleAddress: ...,
 *  moduleType: ...,
 * });
 *
 * ```
 */
export async function isModuleRegisteredAs(
  options: BaseTransactionOptions<IsModuleRegisteredAsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.moduleAddress, options.moduleType],
  });
}
