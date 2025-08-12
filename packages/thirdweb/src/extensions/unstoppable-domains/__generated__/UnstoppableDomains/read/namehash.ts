import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "namehash" function.
 */
export type NamehashParams = {
  labels: AbiParameterToPrimitiveType<{ type: "string[]"; name: "labels" }>;
};

export const FN_SELECTOR = "0x276fabb1" as const;
const FN_INPUTS = [
  {
    name: "labels",
    type: "string[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "hash",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `namehash` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `namehash` method is supported.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { isNamehashSupported } from "thirdweb/extensions/unstoppable-domains";
 * const supported = isNamehashSupported(["0x..."]);
 * ```
 */
export function isNamehashSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "namehash" function.
 * @param options - The options for the namehash function.
 * @returns The encoded ABI parameters.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeNamehashParams } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeNamehashParams({
 *  labels: ...,
 * });
 * ```
 */
export function encodeNamehashParams(options: NamehashParams) {
  return encodeAbiParameters(FN_INPUTS, [options.labels]);
}

/**
 * Encodes the "namehash" function into a Hex string with its parameters.
 * @param options - The options for the namehash function.
 * @returns The encoded hexadecimal string.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeNamehash } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeNamehash({
 *  labels: ...,
 * });
 * ```
 */
export function encodeNamehash(options: NamehashParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeNamehashParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the namehash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { decodeNamehashResult } from "thirdweb/extensions/unstoppable-domains";
 * const result = decodeNamehashResultResult("...");
 * ```
 */
export function decodeNamehashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "namehash" function on the contract.
 * @param options - The options for the namehash function.
 * @returns The parsed result of the function call.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { namehash } from "thirdweb/extensions/unstoppable-domains";
 *
 * const result = await namehash({
 *  contract,
 *  labels: ...,
 * });
 *
 * ```
 */
export async function namehash(
  options: BaseTransactionOptions<NamehashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.labels],
  });
}
