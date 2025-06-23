import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "resolve" function.
 */
export type ResolveParams = {
  handleId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "handleId" }>;
};

export const FN_SELECTOR = "0x4f896d4f" as const;
const FN_INPUTS = [
  {
    name: "handleId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `resolve` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `resolve` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isResolveSupported } from "thirdweb/extensions/lens";
 * const supported = isResolveSupported(["0x..."]);
 * ```
 */
export function isResolveSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "resolve" function.
 * @param options - The options for the resolve function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeResolveParams } from "thirdweb/extensions/lens";
 * const result = encodeResolveParams({
 *  handleId: ...,
 * });
 * ```
 */
export function encodeResolveParams(options: ResolveParams) {
  return encodeAbiParameters(FN_INPUTS, [options.handleId]);
}

/**
 * Encodes the "resolve" function into a Hex string with its parameters.
 * @param options - The options for the resolve function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeResolve } from "thirdweb/extensions/lens";
 * const result = encodeResolve({
 *  handleId: ...,
 * });
 * ```
 */
export function encodeResolve(options: ResolveParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeResolveParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the resolve function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeResolveResult } from "thirdweb/extensions/lens";
 * const result = decodeResolveResultResult("...");
 * ```
 */
export function decodeResolveResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "resolve" function on the contract.
 * @param options - The options for the resolve function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { resolve } from "thirdweb/extensions/lens";
 *
 * const result = await resolve({
 *  contract,
 *  handleId: ...,
 * });
 *
 * ```
 */
export async function resolve(options: BaseTransactionOptions<ResolveParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.handleId],
  });
}
