import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "tokenByIndex" function.
 */
export type TokenByIndexParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
};

export const FN_SELECTOR = "0x4f6ccce7" as const;
const FN_INPUTS = [
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
 * Checks if the `tokenByIndex` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tokenByIndex` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isTokenByIndexSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isTokenByIndexSupported(contract);
 * ```
 */
export async function isTokenByIndexSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenByIndex" function.
 * @param options - The options for the tokenByIndex function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenByIndexParams } "thirdweb/extensions/erc721";
 * const result = encodeTokenByIndexParams({
 *  index: ...,
 * });
 * ```
 */
export function encodeTokenByIndexParams(options: TokenByIndexParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "tokenByIndex" function into a Hex string with its parameters.
 * @param options - The options for the tokenByIndex function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokenByIndex } "thirdweb/extensions/erc721";
 * const result = encodeTokenByIndex({
 *  index: ...,
 * });
 * ```
 */
export function encodeTokenByIndex(options: TokenByIndexParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenByIndexParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenByIndex function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeTokenByIndexResult } from "thirdweb/extensions/erc721";
 * const result = decodeTokenByIndexResult("...");
 * ```
 */
export function decodeTokenByIndexResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenByIndex" function on the contract.
 * @param options - The options for the tokenByIndex function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { tokenByIndex } from "thirdweb/extensions/erc721";
 *
 * const result = await tokenByIndex({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function tokenByIndex(
  options: BaseTransactionOptions<TokenByIndexParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
