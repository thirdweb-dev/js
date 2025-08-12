import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPublishedUriFromCompilerUri" function.
 */
export type GetPublishedUriFromCompilerUriParams = {
  compilerMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "compilerMetadataUri";
  }>;
};

export const FN_SELECTOR = "0x819e992f" as const;
const FN_INPUTS = [
  {
    name: "compilerMetadataUri",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "publishedMetadataUris",
    type: "string[]",
  },
] as const;

/**
 * Checks if the `getPublishedUriFromCompilerUri` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPublishedUriFromCompilerUri` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetPublishedUriFromCompilerUriSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetPublishedUriFromCompilerUriSupported(["0x..."]);
 * ```
 */
export function isGetPublishedUriFromCompilerUriSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPublishedUriFromCompilerUri" function.
 * @param options - The options for the getPublishedUriFromCompilerUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedUriFromCompilerUriParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublishedUriFromCompilerUriParams({
 *  compilerMetadataUri: ...,
 * });
 * ```
 */
export function encodeGetPublishedUriFromCompilerUriParams(
  options: GetPublishedUriFromCompilerUriParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.compilerMetadataUri]);
}

/**
 * Encodes the "getPublishedUriFromCompilerUri" function into a Hex string with its parameters.
 * @param options - The options for the getPublishedUriFromCompilerUri function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedUriFromCompilerUri } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublishedUriFromCompilerUri({
 *  compilerMetadataUri: ...,
 * });
 * ```
 */
export function encodeGetPublishedUriFromCompilerUri(
  options: GetPublishedUriFromCompilerUriParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPublishedUriFromCompilerUriParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPublishedUriFromCompilerUri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublishedUriFromCompilerUriResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublishedUriFromCompilerUriResultResult("...");
 * ```
 */
export function decodeGetPublishedUriFromCompilerUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPublishedUriFromCompilerUri" function on the contract.
 * @param options - The options for the getPublishedUriFromCompilerUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getPublishedUriFromCompilerUri } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getPublishedUriFromCompilerUri({
 *  contract,
 *  compilerMetadataUri: ...,
 * });
 *
 * ```
 */
export async function getPublishedUriFromCompilerUri(
  options: BaseTransactionOptions<GetPublishedUriFromCompilerUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.compilerMetadataUri],
  });
}
