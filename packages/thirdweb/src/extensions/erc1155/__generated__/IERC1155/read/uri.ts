import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "uri" function.
 */
export type UriParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x0e89341c" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Encodes the parameters for the "uri" function.
 * @param options - The options for the uri function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeUriParams } "thirdweb/extensions/erc1155";
 * const result = encodeUriParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeUriParams(options: UriParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Decodes the result of the uri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeUriResult } from "thirdweb/extensions/erc1155";
 * const result = decodeUriResult("...");
 * ```
 */
export function decodeUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "uri" function on the contract.
 * @param options - The options for the uri function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { uri } from "thirdweb/extensions/erc1155";
 *
 * const result = await uri({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function uri(options: BaseTransactionOptions<UriParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
