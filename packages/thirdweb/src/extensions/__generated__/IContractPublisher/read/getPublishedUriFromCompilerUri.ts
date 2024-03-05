import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPublishedUriFromCompilerUri" function.
 */
export type GetPublishedUriFromCompilerUriParams = {
  compilerMetadataUri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "compilerMetadataUri";
    type: "string";
  }>;
};

/**
 * Calls the getPublishedUriFromCompilerUri function on the contract.
 * @param options - The options for the getPublishedUriFromCompilerUri function.
 * @returns The parsed result of the function call.
 * @extension ICONTRACTPUBLISHER
 * @example
 * ```
 * import { getPublishedUriFromCompilerUri } from "thirdweb/extensions/IContractPublisher";
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
    method: [
      "0x819e992f",
      [
        {
          internalType: "string",
          name: "compilerMetadataUri",
          type: "string",
        },
      ],
      [
        {
          internalType: "string[]",
          name: "publishedMetadataUris",
          type: "string[]",
        },
      ],
    ],
    params: [options.compilerMetadataUri],
  });
}
