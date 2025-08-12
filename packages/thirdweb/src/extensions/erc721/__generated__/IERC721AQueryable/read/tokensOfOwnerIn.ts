import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "tokensOfOwnerIn" function.
 */
export type TokensOfOwnerInParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  start: AbiParameterToPrimitiveType<{ type: "uint256"; name: "start" }>;
  stop: AbiParameterToPrimitiveType<{ type: "uint256"; name: "stop" }>;
};

export const FN_SELECTOR = "0x99a2557a" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
  },
  {
    name: "start",
    type: "uint256",
  },
  {
    name: "stop",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256[]",
  },
] as const;

/**
 * Checks if the `tokensOfOwnerIn` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `tokensOfOwnerIn` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isTokensOfOwnerInSupported } from "thirdweb/extensions/erc721";
 * const supported = isTokensOfOwnerInSupported(["0x..."]);
 * ```
 */
export function isTokensOfOwnerInSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokensOfOwnerIn" function.
 * @param options - The options for the tokensOfOwnerIn function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokensOfOwnerInParams } from "thirdweb/extensions/erc721";
 * const result = encodeTokensOfOwnerInParams({
 *  owner: ...,
 *  start: ...,
 *  stop: ...,
 * });
 * ```
 */
export function encodeTokensOfOwnerInParams(options: TokensOfOwnerInParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.owner,
    options.start,
    options.stop,
  ]);
}

/**
 * Encodes the "tokensOfOwnerIn" function into a Hex string with its parameters.
 * @param options - The options for the tokensOfOwnerIn function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTokensOfOwnerIn } from "thirdweb/extensions/erc721";
 * const result = encodeTokensOfOwnerIn({
 *  owner: ...,
 *  start: ...,
 *  stop: ...,
 * });
 * ```
 */
export function encodeTokensOfOwnerIn(options: TokensOfOwnerInParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokensOfOwnerInParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokensOfOwnerIn function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeTokensOfOwnerInResult } from "thirdweb/extensions/erc721";
 * const result = decodeTokensOfOwnerInResultResult("...");
 * ```
 */
export function decodeTokensOfOwnerInResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokensOfOwnerIn" function on the contract.
 * @param options - The options for the tokensOfOwnerIn function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { tokensOfOwnerIn } from "thirdweb/extensions/erc721";
 *
 * const result = await tokensOfOwnerIn({
 *  contract,
 *  owner: ...,
 *  start: ...,
 *  stop: ...,
 * });
 *
 * ```
 */
export async function tokensOfOwnerIn(
  options: BaseTransactionOptions<TokensOfOwnerInParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.start, options.stop],
  });
}
