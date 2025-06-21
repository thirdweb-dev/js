import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "supportsExecutionMode" function.
 */
export type SupportsExecutionModeParams = {
  encodedMode: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "encodedMode";
  }>;
};

export const FN_SELECTOR = "0xd03c7914" as const;
const FN_INPUTS = [
  {
    name: "encodedMode",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `supportsExecutionMode` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `supportsExecutionMode` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isSupportsExecutionModeSupported } from "thirdweb/extensions/erc7579";
 * const supported = isSupportsExecutionModeSupported(["0x..."]);
 * ```
 */
export function isSupportsExecutionModeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "supportsExecutionMode" function.
 * @param options - The options for the supportsExecutionMode function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsExecutionModeParams } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsExecutionModeParams({
 *  encodedMode: ...,
 * });
 * ```
 */
export function encodeSupportsExecutionModeParams(
  options: SupportsExecutionModeParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.encodedMode]);
}

/**
 * Encodes the "supportsExecutionMode" function into a Hex string with its parameters.
 * @param options - The options for the supportsExecutionMode function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeSupportsExecutionMode } from "thirdweb/extensions/erc7579";
 * const result = encodeSupportsExecutionMode({
 *  encodedMode: ...,
 * });
 * ```
 */
export function encodeSupportsExecutionMode(
  options: SupportsExecutionModeParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSupportsExecutionModeParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the supportsExecutionMode function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeSupportsExecutionModeResult } from "thirdweb/extensions/erc7579";
 * const result = decodeSupportsExecutionModeResultResult("...");
 * ```
 */
export function decodeSupportsExecutionModeResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "supportsExecutionMode" function on the contract.
 * @param options - The options for the supportsExecutionMode function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { supportsExecutionMode } from "thirdweb/extensions/erc7579";
 *
 * const result = await supportsExecutionMode({
 *  contract,
 *  encodedMode: ...,
 * });
 *
 * ```
 */
export async function supportsExecutionMode(
  options: BaseTransactionOptions<SupportsExecutionModeParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.encodedMode],
  });
}
