import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    type: "address",
    name: "owner",
  },
  {
    type: "uint256",
    name: "start",
  },
  {
    type: "uint256",
    name: "stop",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256[]",
  },
] as const;

/**
 * Checks if the `tokensOfOwnerIn` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tokensOfOwnerIn` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isTokensOfOwnerInSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isTokensOfOwnerInSupported(contract);
 * ```
 */
export async function isTokensOfOwnerInSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeTokensOfOwnerInParams } "thirdweb/extensions/erc721";
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
 * import { encodeTokensOfOwnerIn } "thirdweb/extensions/erc721";
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
 * const result = decodeTokensOfOwnerInResult("...");
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
