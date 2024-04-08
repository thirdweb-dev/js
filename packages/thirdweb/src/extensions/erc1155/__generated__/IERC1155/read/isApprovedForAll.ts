import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isApprovedForAll" function.
 */
export type IsApprovedForAllParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "_operator" }>;
};

export const FN_SELECTOR = "0xe985e9c5" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_owner",
  },
  {
    type: "address",
    name: "_operator",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "isApprovedForAll" function.
 * @param options - The options for the isApprovedForAll function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeIsApprovedForAllParams } "thirdweb/extensions/erc1155";
 * const result = encodeIsApprovedForAllParams({
 *  owner: ...,
 *  operator: ...,
 * });
 * ```
 */
export function encodeIsApprovedForAllParams(options: IsApprovedForAllParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.operator]);
}

/**
 * Decodes the result of the isApprovedForAll function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeIsApprovedForAllResult } from "thirdweb/extensions/erc1155";
 * const result = decodeIsApprovedForAllResult("...");
 * ```
 */
export function decodeIsApprovedForAllResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isApprovedForAll" function on the contract.
 * @param options - The options for the isApprovedForAll function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isApprovedForAll } from "thirdweb/extensions/erc1155";
 *
 * const result = await isApprovedForAll({
 *  owner: ...,
 *  operator: ...,
 * });
 *
 * ```
 */
export async function isApprovedForAll(
  options: BaseTransactionOptions<IsApprovedForAllParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.operator],
  });
}
