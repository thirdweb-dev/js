import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRoleAdmin" function.
 */
export type GetRoleAdminParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
};

export const FN_SELECTOR = "0x248a9ca3" as const;
const FN_INPUTS = [
  {
    name: "role",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `getRoleAdmin` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRoleAdmin` method is supported.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { isGetRoleAdminSupported } from "thirdweb/extensions/permissions";
 * const supported = isGetRoleAdminSupported(["0x..."]);
 * ```
 */
export function isGetRoleAdminSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRoleAdmin" function.
 * @param options - The options for the getRoleAdmin function.
 * @returns The encoded ABI parameters.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeGetRoleAdminParams } from "thirdweb/extensions/permissions";
 * const result = encodeGetRoleAdminParams({
 *  role: ...,
 * });
 * ```
 */
export function encodeGetRoleAdminParams(options: GetRoleAdminParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role]);
}

/**
 * Encodes the "getRoleAdmin" function into a Hex string with its parameters.
 * @param options - The options for the getRoleAdmin function.
 * @returns The encoded hexadecimal string.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeGetRoleAdmin } from "thirdweb/extensions/permissions";
 * const result = encodeGetRoleAdmin({
 *  role: ...,
 * });
 * ```
 */
export function encodeGetRoleAdmin(options: GetRoleAdminParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRoleAdminParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getRoleAdmin function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { decodeGetRoleAdminResult } from "thirdweb/extensions/permissions";
 * const result = decodeGetRoleAdminResultResult("...");
 * ```
 */
export function decodeGetRoleAdminResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { getRoleAdmin } from "thirdweb/extensions/permissions";
 *
 * const result = await getRoleAdmin({
 *  contract,
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.role],
  });
}
