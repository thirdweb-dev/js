import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `tokenURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `tokenURI` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isTokenURISupported } from "thirdweb/extensions/erc721";
 * const supported = isTokenURISupported(["0x..."]);
 * ```
 */
export function isTokenURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenURI" function.
 * @param options - The options for the tokenURI function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenURIParams } from "thirdweb/extensions/erc721";
 * const result = encodeTokenURIParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTokenURIParams(options: TokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "tokenURI" function into a Hex string with its parameters.
 * @param options - The options for the tokenURI function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenURI } from "thirdweb/extensions/erc721";
 * const result = encodeTokenURI({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTokenURI(options: TokenURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenURIParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeTokenURIResult } from "thirdweb/extensions/erc721";
 * const result = decodeTokenURIResultResult("...");
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
 *  contract,
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
