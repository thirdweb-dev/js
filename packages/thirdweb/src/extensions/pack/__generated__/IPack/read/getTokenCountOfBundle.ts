import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getTokenCountOfBundle" function.
 */
export type GetTokenCountOfBundleParams = {
  bundleId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_bundleId" }>;
};

export const FN_SELECTOR = "0xd0d2fe25" as const;
const FN_INPUTS = [
  {
    name: "_bundleId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getTokenCountOfBundle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getTokenCountOfBundle` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isGetTokenCountOfBundleSupported } from "thirdweb/extensions/pack";
 * const supported = isGetTokenCountOfBundleSupported(["0x..."]);
 * ```
 */
export function isGetTokenCountOfBundleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getTokenCountOfBundle" function.
 * @param options - The options for the getTokenCountOfBundle function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetTokenCountOfBundleParams } from "thirdweb/extensions/pack";
 * const result = encodeGetTokenCountOfBundleParams({
 *  bundleId: ...,
 * });
 * ```
 */
export function encodeGetTokenCountOfBundleParams(
  options: GetTokenCountOfBundleParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.bundleId]);
}

/**
 * Encodes the "getTokenCountOfBundle" function into a Hex string with its parameters.
 * @param options - The options for the getTokenCountOfBundle function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetTokenCountOfBundle } from "thirdweb/extensions/pack";
 * const result = encodeGetTokenCountOfBundle({
 *  bundleId: ...,
 * });
 * ```
 */
export function encodeGetTokenCountOfBundle(
  options: GetTokenCountOfBundleParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetTokenCountOfBundleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getTokenCountOfBundle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeGetTokenCountOfBundleResult } from "thirdweb/extensions/pack";
 * const result = decodeGetTokenCountOfBundleResultResult("...");
 * ```
 */
export function decodeGetTokenCountOfBundleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getTokenCountOfBundle" function on the contract.
 * @param options - The options for the getTokenCountOfBundle function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { getTokenCountOfBundle } from "thirdweb/extensions/pack";
 *
 * const result = await getTokenCountOfBundle({
 *  contract,
 *  bundleId: ...,
 * });
 *
 * ```
 */
export async function getTokenCountOfBundle(
  options: BaseTransactionOptions<GetTokenCountOfBundleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.bundleId],
  });
}
