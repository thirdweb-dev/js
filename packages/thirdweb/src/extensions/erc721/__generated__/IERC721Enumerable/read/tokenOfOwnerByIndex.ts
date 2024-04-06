import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "tokenOfOwnerByIndex" function.
 */
export type TokenOfOwnerByIndexParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
};

export const FN_SELECTOR = "0x2f745c59" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_owner",
  },
  {
    type: "uint256",
    name: "_index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "tokenOfOwnerByIndex" function.
 * @param options - The options for the tokenOfOwnerByIndex function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenOfOwnerByIndexParams } "thirdweb/extensions/erc721";
 * const result = encodeTokenOfOwnerByIndexParams({
 *  owner: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeTokenOfOwnerByIndexParams(
  options: TokenOfOwnerByIndexParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.index]);
}

/**
 * Decodes the result of the tokenOfOwnerByIndex function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeTokenOfOwnerByIndexResult } from "thirdweb/extensions/erc721";
 * const result = decodeTokenOfOwnerByIndexResult("...");
 * ```
 */
export function decodeTokenOfOwnerByIndexResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenOfOwnerByIndex" function on the contract.
 * @param options - The options for the tokenOfOwnerByIndex function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";
 *
 * const result = await tokenOfOwnerByIndex({
 *  owner: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function tokenOfOwnerByIndex(
  options: BaseTransactionOptions<TokenOfOwnerByIndexParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.index],
  });
}
