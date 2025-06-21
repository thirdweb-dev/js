import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getTokenOfBundle" function.
 */
export type GetTokenOfBundleParams = {
  bundleId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_bundleId" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

export const FN_SELECTOR = "0x1da799c9" as const;
const FN_INPUTS = [
  {
    name: "_bundleId",
    type: "uint256",
  },
  {
    name: "index",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "totalAmount",
        type: "uint256",
      },
    ],
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getTokenOfBundle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getTokenOfBundle` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isGetTokenOfBundleSupported } from "thirdweb/extensions/pack";
 * const supported = isGetTokenOfBundleSupported(["0x..."]);
 * ```
 */
export function isGetTokenOfBundleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getTokenOfBundle" function.
 * @param options - The options for the getTokenOfBundle function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetTokenOfBundleParams } from "thirdweb/extensions/pack";
 * const result = encodeGetTokenOfBundleParams({
 *  bundleId: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeGetTokenOfBundleParams(options: GetTokenOfBundleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.bundleId, options.index]);
}

/**
 * Encodes the "getTokenOfBundle" function into a Hex string with its parameters.
 * @param options - The options for the getTokenOfBundle function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetTokenOfBundle } from "thirdweb/extensions/pack";
 * const result = encodeGetTokenOfBundle({
 *  bundleId: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeGetTokenOfBundle(options: GetTokenOfBundleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetTokenOfBundleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getTokenOfBundle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeGetTokenOfBundleResult } from "thirdweb/extensions/pack";
 * const result = decodeGetTokenOfBundleResultResult("...");
 * ```
 */
export function decodeGetTokenOfBundleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getTokenOfBundle" function on the contract.
 * @param options - The options for the getTokenOfBundle function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { getTokenOfBundle } from "thirdweb/extensions/pack";
 *
 * const result = await getTokenOfBundle({
 *  contract,
 *  bundleId: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function getTokenOfBundle(
  options: BaseTransactionOptions<GetTokenOfBundleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.bundleId, options.index],
  });
}
