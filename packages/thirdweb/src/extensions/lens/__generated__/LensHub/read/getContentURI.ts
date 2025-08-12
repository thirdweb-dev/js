import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getContentURI" function.
 */
export type GetContentURIParams = {
  profileId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "profileId";
  }>;
  pubId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "pubId" }>;
};

export const FN_SELECTOR = "0xb5a31496" as const;
const FN_INPUTS = [
  {
    name: "profileId",
    type: "uint256",
  },
  {
    name: "pubId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `getContentURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getContentURI` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetContentURISupported } from "thirdweb/extensions/lens";
 * const supported = isGetContentURISupported(["0x..."]);
 * ```
 */
export function isGetContentURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getContentURI" function.
 * @param options - The options for the getContentURI function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetContentURIParams } from "thirdweb/extensions/lens";
 * const result = encodeGetContentURIParams({
 *  profileId: ...,
 *  pubId: ...,
 * });
 * ```
 */
export function encodeGetContentURIParams(options: GetContentURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.profileId, options.pubId]);
}

/**
 * Encodes the "getContentURI" function into a Hex string with its parameters.
 * @param options - The options for the getContentURI function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetContentURI } from "thirdweb/extensions/lens";
 * const result = encodeGetContentURI({
 *  profileId: ...,
 *  pubId: ...,
 * });
 * ```
 */
export function encodeGetContentURI(options: GetContentURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetContentURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getContentURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetContentURIResult } from "thirdweb/extensions/lens";
 * const result = decodeGetContentURIResultResult("...");
 * ```
 */
export function decodeGetContentURIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getContentURI" function on the contract.
 * @param options - The options for the getContentURI function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getContentURI } from "thirdweb/extensions/lens";
 *
 * const result = await getContentURI({
 *  contract,
 *  profileId: ...,
 *  pubId: ...,
 * });
 *
 * ```
 */
export async function getContentURI(
  options: BaseTransactionOptions<GetContentURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.profileId, options.pubId],
  });
}
