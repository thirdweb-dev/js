import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "string",
    name: "compilerMetadataUri",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string[]",
    name: "publishedMetadataUris",
  },
] as const;

/**
 * Encodes the parameters for the "getPublishedUriFromCompilerUri" function.
 * @param options - The options for the getPublishedUriFromCompilerUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublishedUriFromCompilerUriParams } "thirdweb/extensions/thirdweb";
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
 * Decodes the result of the getPublishedUriFromCompilerUri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublishedUriFromCompilerUriResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublishedUriFromCompilerUriResult("...");
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
