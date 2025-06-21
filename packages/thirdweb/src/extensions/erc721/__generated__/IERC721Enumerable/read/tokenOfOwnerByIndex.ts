import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "_owner",
    type: "address",
  },
  {
    name: "_index",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `tokenOfOwnerByIndex` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `tokenOfOwnerByIndex` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isTokenOfOwnerByIndexSupported } from "thirdweb/extensions/erc721";
 * const supported = isTokenOfOwnerByIndexSupported(["0x..."]);
 * ```
 */
export function isTokenOfOwnerByIndexSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenOfOwnerByIndex" function.
 * @param options - The options for the tokenOfOwnerByIndex function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenOfOwnerByIndexParams } from "thirdweb/extensions/erc721";
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
 * Encodes the "tokenOfOwnerByIndex" function into a Hex string with its parameters.
 * @param options - The options for the tokenOfOwnerByIndex function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenOfOwnerByIndex } from "thirdweb/extensions/erc721";
 * const result = encodeTokenOfOwnerByIndex({
 *  owner: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeTokenOfOwnerByIndex(options: TokenOfOwnerByIndexParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenOfOwnerByIndexParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenOfOwnerByIndex function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeTokenOfOwnerByIndexResult } from "thirdweb/extensions/erc721";
 * const result = decodeTokenOfOwnerByIndexResultResult("...");
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
 *  contract,
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
