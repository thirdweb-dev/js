import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "tokenURI" function.
 */
export type TokenURIParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0xc87b56dd" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Encodes the parameters for the "tokenURI" function.
 * @param options - The options for the tokenURI function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenURIParams } "thirdweb/extensions/erc721";
 * const result = encodeTokenURIParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTokenURIParams(options: TokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Decodes the result of the tokenURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeTokenURIResult } from "thirdweb/extensions/erc721";
 * const result = decodeTokenURIResult("...");
 * ```
 */
export function decodeTokenURIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenURI" function on the contract.
 * @param options - The options for the tokenURI function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { tokenURI } from "thirdweb/extensions/erc721";
 *
 * const result = await tokenURI({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function tokenURI(
  options: BaseTransactionOptions<TokenURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
