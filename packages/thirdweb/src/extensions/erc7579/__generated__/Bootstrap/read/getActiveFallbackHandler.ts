import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getActiveFallbackHandler" function.
 */
export type GetActiveFallbackHandlerParams = {
  functionSig: AbiParameterToPrimitiveType<{
    type: "bytes4";
    name: "functionSig";
  }>;
};

export const FN_SELECTOR = "0xeac9b20d" as const;
const FN_INPUTS = [
  {
    type: "bytes4",
    name: "functionSig",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    components: [
      {
        type: "address",
        name: "handler",
      },
      {
        type: "bytes1",
        name: "calltype",
      },
    ],
  },
] as const;

/**
 * Checks if the `getActiveFallbackHandler` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getActiveFallbackHandler` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isGetActiveFallbackHandlerSupported } from "thirdweb/extensions/erc7579";
 * const supported = isGetActiveFallbackHandlerSupported(["0x..."]);
 * ```
 */
export function isGetActiveFallbackHandlerSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getActiveFallbackHandler" function.
 * @param options - The options for the getActiveFallbackHandler function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetActiveFallbackHandlerParams } from "thirdweb/extensions/erc7579";
 * const result = encodeGetActiveFallbackHandlerParams({
 *  functionSig: ...,
 * });
 * ```
 */
export function encodeGetActiveFallbackHandlerParams(
  options: GetActiveFallbackHandlerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.functionSig]);
}

/**
 * Encodes the "getActiveFallbackHandler" function into a Hex string with its parameters.
 * @param options - The options for the getActiveFallbackHandler function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetActiveFallbackHandler } from "thirdweb/extensions/erc7579";
 * const result = encodeGetActiveFallbackHandler({
 *  functionSig: ...,
 * });
 * ```
 */
export function encodeGetActiveFallbackHandler(
  options: GetActiveFallbackHandlerParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetActiveFallbackHandlerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getActiveFallbackHandler function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeGetActiveFallbackHandlerResult } from "thirdweb/extensions/erc7579";
 * const result = decodeGetActiveFallbackHandlerResultResult("...");
 * ```
 */
export function decodeGetActiveFallbackHandlerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getActiveFallbackHandler" function on the contract.
 * @param options - The options for the getActiveFallbackHandler function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getActiveFallbackHandler } from "thirdweb/extensions/erc7579";
 *
 * const result = await getActiveFallbackHandler({
 *  contract,
 *  functionSig: ...,
 * });
 *
 * ```
 */
export async function getActiveFallbackHandler(
  options: BaseTransactionOptions<GetActiveFallbackHandlerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.functionSig],
  });
}
