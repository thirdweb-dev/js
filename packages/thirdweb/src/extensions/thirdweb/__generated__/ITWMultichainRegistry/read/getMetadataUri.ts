import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getMetadataUri" function.
 */
export type GetMetadataUriParams = {
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
};

export const FN_SELECTOR = "0xf4c2012d" as const;
const FN_INPUTS = [
  {
    name: "_chainId",
    type: "uint256",
  },
  {
    name: "_deployment",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "metadataUri",
    type: "string",
  },
] as const;

/**
 * Checks if the `getMetadataUri` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getMetadataUri` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetMetadataUriSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetMetadataUriSupported(["0x..."]);
 * ```
 */
export function isGetMetadataUriSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getMetadataUri" function.
 * @param options - The options for the getMetadataUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetMetadataUriParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetMetadataUriParams({
 *  chainId: ...,
 *  deployment: ...,
 * });
 * ```
 */
export function encodeGetMetadataUriParams(options: GetMetadataUriParams) {
  return encodeAbiParameters(FN_INPUTS, [options.chainId, options.deployment]);
}

/**
 * Encodes the "getMetadataUri" function into a Hex string with its parameters.
 * @param options - The options for the getMetadataUri function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetMetadataUri } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetMetadataUri({
 *  chainId: ...,
 *  deployment: ...,
 * });
 * ```
 */
export function encodeGetMetadataUri(options: GetMetadataUriParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetMetadataUriParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getMetadataUri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetMetadataUriResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetMetadataUriResultResult("...");
 * ```
 */
export function decodeGetMetadataUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getMetadataUri" function on the contract.
 * @param options - The options for the getMetadataUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getMetadataUri } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getMetadataUri({
 *  contract,
 *  chainId: ...,
 *  deployment: ...,
 * });
 *
 * ```
 */
export async function getMetadataUri(
  options: BaseTransactionOptions<GetMetadataUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.chainId, options.deployment],
  });
}
