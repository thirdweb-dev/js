import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "onTokenURI" function.
 */
export type OnTokenURIParams = {
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_id" }>;
};

export const FN_SELECTOR = "0xcfc0cb96" as const;
const FN_INPUTS = [
  {
    name: "_id",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `onTokenURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `onTokenURI` method is supported.
 * @modules OpenEditionMetadataERC721
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 * const supported = OpenEditionMetadataERC721.isOnTokenURISupported(["0x..."]);
 * ```
 */
export function isOnTokenURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "onTokenURI" function.
 * @param options - The options for the onTokenURI function.
 * @returns The encoded ABI parameters.
 * @modules OpenEditionMetadataERC721
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 * const result = OpenEditionMetadataERC721.encodeOnTokenURIParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeOnTokenURIParams(options: OnTokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Encodes the "onTokenURI" function into a Hex string with its parameters.
 * @param options - The options for the onTokenURI function.
 * @returns The encoded hexadecimal string.
 * @modules OpenEditionMetadataERC721
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 * const result = OpenEditionMetadataERC721.encodeOnTokenURI({
 *  id: ...,
 * });
 * ```
 */
export function encodeOnTokenURI(options: OnTokenURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOnTokenURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the onTokenURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules OpenEditionMetadataERC721
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 * const result = OpenEditionMetadataERC721.decodeOnTokenURIResultResult("...");
 * ```
 */
export function decodeOnTokenURIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "onTokenURI" function on the contract.
 * @param options - The options for the onTokenURI function.
 * @returns The parsed result of the function call.
 * @modules OpenEditionMetadataERC721
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 *
 * const result = await OpenEditionMetadataERC721.onTokenURI({
 *  contract,
 *  id: ...,
 * });
 *
 * ```
 */
export async function onTokenURI(
  options: BaseTransactionOptions<OnTokenURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.id],
  });
}
