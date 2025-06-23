import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "reverseNameOf" function.
 */
export type ReverseNameOfParams = {
  addr: AbiParameterToPrimitiveType<{ type: "address"; name: "addr" }>;
};

export const FN_SELECTOR = "0xbebec6b4" as const;
const FN_INPUTS = [
  {
    name: "addr",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "reverseUri",
    type: "string",
  },
] as const;

/**
 * Checks if the `reverseNameOf` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `reverseNameOf` method is supported.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { isReverseNameOfSupported } from "thirdweb/extensions/unstoppable-domains";
 * const supported = isReverseNameOfSupported(["0x..."]);
 * ```
 */
export function isReverseNameOfSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "reverseNameOf" function.
 * @param options - The options for the reverseNameOf function.
 * @returns The encoded ABI parameters.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeReverseNameOfParams } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeReverseNameOfParams({
 *  addr: ...,
 * });
 * ```
 */
export function encodeReverseNameOfParams(options: ReverseNameOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.addr]);
}

/**
 * Encodes the "reverseNameOf" function into a Hex string with its parameters.
 * @param options - The options for the reverseNameOf function.
 * @returns The encoded hexadecimal string.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeReverseNameOf } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeReverseNameOf({
 *  addr: ...,
 * });
 * ```
 */
export function encodeReverseNameOf(options: ReverseNameOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeReverseNameOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the reverseNameOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { decodeReverseNameOfResult } from "thirdweb/extensions/unstoppable-domains";
 * const result = decodeReverseNameOfResultResult("...");
 * ```
 */
export function decodeReverseNameOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "reverseNameOf" function on the contract.
 * @param options - The options for the reverseNameOf function.
 * @returns The parsed result of the function call.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { reverseNameOf } from "thirdweb/extensions/unstoppable-domains";
 *
 * const result = await reverseNameOf({
 *  contract,
 *  addr: ...,
 * });
 *
 * ```
 */
export async function reverseNameOf(
  options: BaseTransactionOptions<ReverseNameOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.addr],
  });
}
