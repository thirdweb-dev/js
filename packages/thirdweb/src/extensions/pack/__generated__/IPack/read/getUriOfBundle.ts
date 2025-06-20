import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getUriOfBundle" function.
 */
export type GetUriOfBundleParams = {
  bundleId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_bundleId" }>;
};

export const FN_SELECTOR = "0x61195e94" as const;
const FN_INPUTS = [
  {
    name: "_bundleId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `getUriOfBundle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getUriOfBundle` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isGetUriOfBundleSupported } from "thirdweb/extensions/pack";
 * const supported = isGetUriOfBundleSupported(["0x..."]);
 * ```
 */
export function isGetUriOfBundleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getUriOfBundle" function.
 * @param options - The options for the getUriOfBundle function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetUriOfBundleParams } from "thirdweb/extensions/pack";
 * const result = encodeGetUriOfBundleParams({
 *  bundleId: ...,
 * });
 * ```
 */
export function encodeGetUriOfBundleParams(options: GetUriOfBundleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.bundleId]);
}

/**
 * Encodes the "getUriOfBundle" function into a Hex string with its parameters.
 * @param options - The options for the getUriOfBundle function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetUriOfBundle } from "thirdweb/extensions/pack";
 * const result = encodeGetUriOfBundle({
 *  bundleId: ...,
 * });
 * ```
 */
export function encodeGetUriOfBundle(options: GetUriOfBundleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetUriOfBundleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getUriOfBundle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeGetUriOfBundleResult } from "thirdweb/extensions/pack";
 * const result = decodeGetUriOfBundleResultResult("...");
 * ```
 */
export function decodeGetUriOfBundleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getUriOfBundle" function on the contract.
 * @param options - The options for the getUriOfBundle function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { getUriOfBundle } from "thirdweb/extensions/pack";
 *
 * const result = await getUriOfBundle({
 *  contract,
 *  bundleId: ...,
 * });
 *
 * ```
 */
export async function getUriOfBundle(
  options: BaseTransactionOptions<GetUriOfBundleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.bundleId],
  });
}
