import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x91d14854" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "role",
  },
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "hasRole" function.
 * @param options - The options for the hasRole function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeHasRoleParams } "thirdweb/extensions/common";
 * const result = encodeHasRoleParams({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeHasRoleParams(options: HasRoleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role, options.account]);
}

/**
 * Decodes the result of the hasRole function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeHasRoleResult } from "thirdweb/extensions/common";
 * const result = decodeHasRoleResult("...");
 * ```
 */
export function decodeHasRoleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { hasRole } from "thirdweb/extensions/common";
 *
 * const result = await hasRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRole(options: BaseTransactionOptions<HasRoleParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.role, options.account],
  });
}
