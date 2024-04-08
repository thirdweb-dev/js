import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "royaltyInfo" function.
 */
export type RoyaltyInfoParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  salePrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "salePrice";
  }>;
};

export const FN_SELECTOR = "0x2a55205a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "uint256",
    name: "salePrice",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "receiver",
  },
  {
    type: "uint256",
    name: "royaltyAmount",
  },
] as const;

/**
 * Encodes the parameters for the "royaltyInfo" function.
 * @param options - The options for the royaltyInfo function.
 * @returns The encoded ABI parameters.
 * @extension ERC2981
 * @example
 * ```ts
 * import { encodeRoyaltyInfoParams } "thirdweb/extensions/erc2981";
 * const result = encodeRoyaltyInfoParams({
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 * ```
 */
export function encodeRoyaltyInfoParams(options: RoyaltyInfoParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId, options.salePrice]);
}

/**
 * Decodes the result of the royaltyInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC2981
 * @example
 * ```ts
 * import { decodeRoyaltyInfoResult } from "thirdweb/extensions/erc2981";
 * const result = decodeRoyaltyInfoResult("...");
 * ```
 */
export function decodeRoyaltyInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "royaltyInfo" function on the contract.
 * @param options - The options for the royaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC2981
 * @example
 * ```ts
 * import { royaltyInfo } from "thirdweb/extensions/erc2981";
 *
 * const result = await royaltyInfo({
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 *
 * ```
 */
export async function royaltyInfo(
  options: BaseTransactionOptions<RoyaltyInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId, options.salePrice],
  });
}
