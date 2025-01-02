import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "rolesOf" function.
 */
export type RolesOfParams = {
  user: AbiParameterToPrimitiveType<{ type: "address"; name: "user" }>;
};

export const FN_SELECTOR = "0x2de94807" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "user",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "roles",
  },
] as const;

/**
 * Checks if the `rolesOf` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `rolesOf` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isRolesOfSupported } from "thirdweb/extensions/modules";
 * const supported = isRolesOfSupported(["0x..."]);
 * ```
 */
export function isRolesOfSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "rolesOf" function.
 * @param options - The options for the rolesOf function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeRolesOfParams } from "thirdweb/extensions/modules";
 * const result = encodeRolesOfParams({
 *  user: ...,
 * });
 * ```
 */
export function encodeRolesOfParams(options: RolesOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.user]);
}

/**
 * Encodes the "rolesOf" function into a Hex string with its parameters.
 * @param options - The options for the rolesOf function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeRolesOf } from "thirdweb/extensions/modules";
 * const result = encodeRolesOf({
 *  user: ...,
 * });
 * ```
 */
export function encodeRolesOf(options: RolesOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRolesOfParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the rolesOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULES
 * @example
 * ```ts
 * import { decodeRolesOfResult } from "thirdweb/extensions/modules";
 * const result = decodeRolesOfResultResult("...");
 * ```
 */
export function decodeRolesOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "rolesOf" function on the contract.
 * @param options - The options for the rolesOf function.
 * @returns The parsed result of the function call.
 * @extension MODULES
 * @example
 * ```ts
 * import { rolesOf } from "thirdweb/extensions/modules";
 *
 * const result = await rolesOf({
 *  contract,
 *  user: ...,
 * });
 *
 * ```
 */
export async function rolesOf(options: BaseTransactionOptions<RolesOfParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.user],
  });
}
