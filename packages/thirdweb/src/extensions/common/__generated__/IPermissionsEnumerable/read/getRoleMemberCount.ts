import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "bytes32",
    name: "role",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "getRoleMemberCount" function.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoleMemberCountParams } "thirdweb/extensions/common";
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
 * Decodes the result of the getRoleMemberCount function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeGetRoleMemberCountResult } from "thirdweb/extensions/common";
 * const result = decodeGetRoleMemberCountResult("...");
 * ```
 */
export function decodeGetRoleMemberCountResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRoleMemberCount" function on the contract.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { getRoleMemberCount } from "thirdweb/extensions/common";
 *
 * const result = await getRoleMemberCount({
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
