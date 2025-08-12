import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRoleMemberCount" function.
 */
export type GetRoleMemberCountParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
};

export const FN_SELECTOR = "0xca15c873" as const;
const FN_INPUTS = [
  {
    name: "role",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getRoleMemberCount` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRoleMemberCount` method is supported.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { isGetRoleMemberCountSupported } from "thirdweb/extensions/permissions";
 * const supported = isGetRoleMemberCountSupported(["0x..."]);
 * ```
 */
export function isGetRoleMemberCountSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRoleMemberCount" function.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The encoded ABI parameters.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeGetRoleMemberCountParams } from "thirdweb/extensions/permissions";
 * const result = encodeGetRoleMemberCountParams({
 *  role: ...,
 * });
 * ```
 */
export function encodeGetRoleMemberCountParams(
  options: GetRoleMemberCountParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.role]);
}

/**
 * Encodes the "getRoleMemberCount" function into a Hex string with its parameters.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The encoded hexadecimal string.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeGetRoleMemberCount } from "thirdweb/extensions/permissions";
 * const result = encodeGetRoleMemberCount({
 *  role: ...,
 * });
 * ```
 */
export function encodeGetRoleMemberCount(options: GetRoleMemberCountParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRoleMemberCountParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getRoleMemberCount function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { decodeGetRoleMemberCountResult } from "thirdweb/extensions/permissions";
 * const result = decodeGetRoleMemberCountResultResult("...");
 * ```
 */
export function decodeGetRoleMemberCountResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRoleMemberCount" function on the contract.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The parsed result of the function call.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { getRoleMemberCount } from "thirdweb/extensions/permissions";
 *
 * const result = await getRoleMemberCount({
 *  contract,
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleMemberCount(
  options: BaseTransactionOptions<GetRoleMemberCountParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.role],
  });
}
