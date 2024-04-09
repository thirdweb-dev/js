import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x00fdd58e" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_owner",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "balanceOf" function.
 * @param options - The options for the balanceOf function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeBalanceOfParams } "thirdweb/extensions/erc1155";
 * const result = encodeBalanceOfParams({
 *  owner: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeBalanceOfParams(options: BalanceOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.tokenId]);
}

/**
 * Decodes the result of the balanceOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeBalanceOfResult } from "thirdweb/extensions/erc1155";
 * const result = decodeBalanceOfResult("...");
 * ```
 */
export function decodeBalanceOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { balanceOf } from "thirdweb/extensions/erc1155";
 *
 * const result = await balanceOf({
 *  owner: ...,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.tokenId],
  });
}
