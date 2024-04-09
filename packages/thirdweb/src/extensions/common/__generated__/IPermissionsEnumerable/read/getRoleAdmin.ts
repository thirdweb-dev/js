import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "bytes32",
    name: "role",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Encodes the parameters for the "getRoleAdmin" function.
 * @param options - The options for the getRoleAdmin function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoleAdminParams } "thirdweb/extensions/common";
 * const result = encodeGetRoleAdminParams({
 *  role: ...,
 * });
 * ```
 */
export function encodeGetRoleAdminParams(options: GetRoleAdminParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role]);
}

/**
 * Decodes the result of the getRoleAdmin function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeGetRoleAdminResult } from "thirdweb/extensions/common";
 * const result = decodeGetRoleAdminResult("...");
 * ```
 */
export function decodeGetRoleAdminResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { getRoleAdmin } from "thirdweb/extensions/common";
 *
 * const result = await getRoleAdmin({
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
