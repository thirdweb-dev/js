import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getMany" function.
 */
export type GetManyParams = {
  keys: AbiParameterToPrimitiveType<{ type: "string[]"; name: "keys" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x1bd8cc1a" as const;
const FN_INPUTS = [
  {
    name: "keys",
    type: "string[]",
  },
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "values",
    type: "string[]",
  },
] as const;

/**
 * Checks if the `getMany` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getMany` method is supported.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { isGetManySupported } from "thirdweb/extensions/unstoppable-domains";
 * const supported = isGetManySupported(["0x..."]);
 * ```
 */
export function isGetManySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getMany" function.
 * @param options - The options for the getMany function.
 * @returns The encoded ABI parameters.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeGetManyParams } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeGetManyParams({
 *  keys: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetManyParams(options: GetManyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.keys, options.tokenId]);
}

/**
 * Encodes the "getMany" function into a Hex string with its parameters.
 * @param options - The options for the getMany function.
 * @returns The encoded hexadecimal string.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { encodeGetMany } from "thirdweb/extensions/unstoppable-domains";
 * const result = encodeGetMany({
 *  keys: ...,
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetMany(options: GetManyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetManyParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getMany function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { decodeGetManyResult } from "thirdweb/extensions/unstoppable-domains";
 * const result = decodeGetManyResultResult("...");
 * ```
 */
export function decodeGetManyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getMany" function on the contract.
 * @param options - The options for the getMany function.
 * @returns The parsed result of the function call.
 * @extension UNSTOPPABLE-DOMAINS
 * @example
 * ```ts
 * import { getMany } from "thirdweb/extensions/unstoppable-domains";
 *
 * const result = await getMany({
 *  contract,
 *  keys: ...,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getMany(options: BaseTransactionOptions<GetManyParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.keys, options.tokenId],
  });
}
