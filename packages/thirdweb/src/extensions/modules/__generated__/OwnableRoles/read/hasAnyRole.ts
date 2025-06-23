import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "hasAnyRole" function.
 */
export type HasAnyRoleParams = {
  user: AbiParameterToPrimitiveType<{ type: "address"; name: "user" }>;
  roles: AbiParameterToPrimitiveType<{ type: "uint256"; name: "roles" }>;
};

export const FN_SELECTOR = "0x514e62fc" as const;
const FN_INPUTS = [
  {
    name: "user",
    type: "address",
  },
  {
    name: "roles",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `hasAnyRole` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `hasAnyRole` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isHasAnyRoleSupported } from "thirdweb/extensions/modules";
 * const supported = isHasAnyRoleSupported(["0x..."]);
 * ```
 */
export function isHasAnyRoleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "hasAnyRole" function.
 * @param options - The options for the hasAnyRole function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeHasAnyRoleParams } from "thirdweb/extensions/modules";
 * const result = encodeHasAnyRoleParams({
 *  user: ...,
 *  roles: ...,
 * });
 * ```
 */
export function encodeHasAnyRoleParams(options: HasAnyRoleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.user, options.roles]);
}

/**
 * Encodes the "hasAnyRole" function into a Hex string with its parameters.
 * @param options - The options for the hasAnyRole function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeHasAnyRole } from "thirdweb/extensions/modules";
 * const result = encodeHasAnyRole({
 *  user: ...,
 *  roles: ...,
 * });
 * ```
 */
export function encodeHasAnyRole(options: HasAnyRoleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeHasAnyRoleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the hasAnyRole function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULES
 * @example
 * ```ts
 * import { decodeHasAnyRoleResult } from "thirdweb/extensions/modules";
 * const result = decodeHasAnyRoleResultResult("...");
 * ```
 */
export function decodeHasAnyRoleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "hasAnyRole" function on the contract.
 * @param options - The options for the hasAnyRole function.
 * @returns The parsed result of the function call.
 * @extension MODULES
 * @example
 * ```ts
 * import { hasAnyRole } from "thirdweb/extensions/modules";
 *
 * const result = await hasAnyRole({
 *  contract,
 *  user: ...,
 *  roles: ...,
 * });
 *
 * ```
 */
export async function hasAnyRole(
  options: BaseTransactionOptions<HasAnyRoleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.user, options.roles],
  });
}
