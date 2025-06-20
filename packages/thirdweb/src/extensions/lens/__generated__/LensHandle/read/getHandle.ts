import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getHandle" function.
 */
export type GetHandleParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0xec81d194" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `getHandle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getHandle` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetHandleSupported } from "thirdweb/extensions/lens";
 * const supported = isGetHandleSupported(["0x..."]);
 * ```
 */
export function isGetHandleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getHandle" function.
 * @param options - The options for the getHandle function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetHandleParams } from "thirdweb/extensions/lens";
 * const result = encodeGetHandleParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetHandleParams(options: GetHandleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getHandle" function into a Hex string with its parameters.
 * @param options - The options for the getHandle function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetHandle } from "thirdweb/extensions/lens";
 * const result = encodeGetHandle({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetHandle(options: GetHandleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetHandleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getHandle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetHandleResult } from "thirdweb/extensions/lens";
 * const result = decodeGetHandleResultResult("...");
 * ```
 */
export function decodeGetHandleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getHandle" function on the contract.
 * @param options - The options for the getHandle function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getHandle } from "thirdweb/extensions/lens";
 *
 * const result = await getHandle({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getHandle(
  options: BaseTransactionOptions<GetHandleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
