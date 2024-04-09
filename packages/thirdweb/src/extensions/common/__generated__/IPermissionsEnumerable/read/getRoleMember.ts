import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRoleMember" function.
 */
export type GetRoleMemberParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

export const FN_SELECTOR = "0x9010d07c" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "role",
  },
  {
    type: "uint256",
    name: "index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "getRoleMember" function.
 * @param options - The options for the getRoleMember function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoleMemberParams } "thirdweb/extensions/common";
 * const result = encodeGetRoleMemberParams({
 *  role: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeGetRoleMemberParams(options: GetRoleMemberParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role, options.index]);
}

/**
 * Decodes the result of the getRoleMember function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeGetRoleMemberResult } from "thirdweb/extensions/common";
 * const result = decodeGetRoleMemberResult("...");
 * ```
 */
export function decodeGetRoleMemberResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRoleMember" function on the contract.
 * @param options - The options for the getRoleMember function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { getRoleMember } from "thirdweb/extensions/common";
 *
 * const result = await getRoleMember({
 *  role: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function getRoleMember(
  options: BaseTransactionOptions<GetRoleMemberParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.role, options.index],
  });
}
