import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPublishedUriFromCompilerUri" function.
 */
export type GetPublishedUriFromCompilerUriParams = {
  compilerMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "compilerMetadataUri";
  }>;
};

const METHOD = [
  "0x819e992f",
  [
    {
      type: "string",
      name: "compilerMetadataUri",
    },
  ],
  [
    {
      type: "string[]",
      name: "publishedMetadataUris",
    },
  ],
] as const;

/**
 * Calls the "getPublishedUriFromCompilerUri" function on the contract.
 * @param options - The options for the getPublishedUriFromCompilerUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
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
    method: METHOD,
    params: [options.compilerMetadataUri],
  });
}
