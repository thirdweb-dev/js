import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "tokenDataOf" function.
 */
export type TokenDataOfParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0xc0da9bcd" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    components: [
      {
        type: "address",
        name: "owner",
      },
      {
        type: "uint96",
        name: "mintTimestamp",
      },
    ],
  },
] as const;

/**
 * Checks if the `tokenDataOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tokenDataOf` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isTokenDataOfSupported } from "thirdweb/extensions/lens";
 *
 * const supported = await isTokenDataOfSupported(contract);
 * ```
 */
export async function isTokenDataOfSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tokenDataOf" function.
 * @param options - The options for the tokenDataOf function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeTokenDataOfParams } "thirdweb/extensions/lens";
 * const result = encodeTokenDataOfParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTokenDataOfParams(options: TokenDataOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "tokenDataOf" function into a Hex string with its parameters.
 * @param options - The options for the tokenDataOf function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeTokenDataOf } "thirdweb/extensions/lens";
 * const result = encodeTokenDataOf({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTokenDataOf(options: TokenDataOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTokenDataOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the tokenDataOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeTokenDataOfResult } from "thirdweb/extensions/lens";
 * const result = decodeTokenDataOfResult("...");
 * ```
 */
export function decodeTokenDataOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "tokenDataOf" function on the contract.
 * @param options - The options for the tokenDataOf function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { tokenDataOf } from "thirdweb/extensions/lens";
 *
 * const result = await tokenDataOf({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function tokenDataOf(
  options: BaseTransactionOptions<TokenDataOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
