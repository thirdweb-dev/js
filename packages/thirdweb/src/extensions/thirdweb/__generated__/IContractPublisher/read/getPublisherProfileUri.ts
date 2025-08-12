import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPublisherProfileUri" function.
 */
export type GetPublisherProfileUriParams = {
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
};

export const FN_SELECTOR = "0x4f781675" as const;
const FN_INPUTS = [
  {
    name: "publisher",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "uri",
    type: "string",
  },
] as const;

/**
 * Checks if the `getPublisherProfileUri` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPublisherProfileUri` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetPublisherProfileUriSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetPublisherProfileUriSupported(["0x..."]);
 * ```
 */
export function isGetPublisherProfileUriSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPublisherProfileUri" function.
 * @param options - The options for the getPublisherProfileUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublisherProfileUriParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublisherProfileUriParams({
 *  publisher: ...,
 * });
 * ```
 */
export function encodeGetPublisherProfileUriParams(
  options: GetPublisherProfileUriParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.publisher]);
}

/**
 * Encodes the "getPublisherProfileUri" function into a Hex string with its parameters.
 * @param options - The options for the getPublisherProfileUri function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetPublisherProfileUri } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetPublisherProfileUri({
 *  publisher: ...,
 * });
 * ```
 */
export function encodeGetPublisherProfileUri(
  options: GetPublisherProfileUriParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPublisherProfileUriParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPublisherProfileUri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetPublisherProfileUriResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetPublisherProfileUriResultResult("...");
 * ```
 */
export function decodeGetPublisherProfileUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPublisherProfileUri" function on the contract.
 * @param options - The options for the getPublisherProfileUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getPublisherProfileUri } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getPublisherProfileUri({
 *  contract,
 *  publisher: ...,
 * });
 *
 * ```
 */
export async function getPublisherProfileUri(
  options: BaseTransactionOptions<GetPublisherProfileUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.publisher],
  });
}
