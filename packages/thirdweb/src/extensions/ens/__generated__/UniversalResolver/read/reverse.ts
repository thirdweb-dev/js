import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "reverse" function.
 */
export type ReverseParams = {
  reverseName: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "reverseName";
  }>;
};

export const FN_SELECTOR = "0xec11c823" as const;
const FN_INPUTS = [
  {
    name: "reverseName",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
  {
    type: "address",
  },
  {
    type: "address",
  },
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `reverse` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `reverse` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isReverseSupported } from "thirdweb/extensions/ens";
 * const supported = isReverseSupported(["0x..."]);
 * ```
 */
export function isReverseSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "reverse" function.
 * @param options - The options for the reverse function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeReverseParams } from "thirdweb/extensions/ens";
 * const result = encodeReverseParams({
 *  reverseName: ...,
 * });
 * ```
 */
export function encodeReverseParams(options: ReverseParams) {
  return encodeAbiParameters(FN_INPUTS, [options.reverseName]);
}

/**
 * Encodes the "reverse" function into a Hex string with its parameters.
 * @param options - The options for the reverse function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeReverse } from "thirdweb/extensions/ens";
 * const result = encodeReverse({
 *  reverseName: ...,
 * });
 * ```
 */
export function encodeReverse(options: ReverseParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeReverseParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the reverse function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeReverseResult } from "thirdweb/extensions/ens";
 * const result = decodeReverseResultResult("...");
 * ```
 */
export function decodeReverseResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "reverse" function on the contract.
 * @param options - The options for the reverse function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { reverse } from "thirdweb/extensions/ens";
 *
 * const result = await reverse({
 *  contract,
 *  reverseName: ...,
 * });
 *
 * ```
 */
export async function reverse(options: BaseTransactionOptions<ReverseParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.reverseName],
  });
}
