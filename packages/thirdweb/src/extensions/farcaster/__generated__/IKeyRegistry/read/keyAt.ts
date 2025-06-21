import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "keyAt" function.
 */
export type KeyAtParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

export const FN_SELECTOR = "0x0ea9442c" as const;
const FN_INPUTS = [
  {
    name: "fid",
    type: "uint256",
  },
  {
    name: "state",
    type: "uint8",
  },
  {
    name: "index",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `keyAt` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `keyAt` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isKeyAtSupported } from "thirdweb/extensions/farcaster";
 * const supported = isKeyAtSupported(["0x..."]);
 * ```
 */
export function isKeyAtSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "keyAt" function.
 * @param options - The options for the keyAt function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeyAtParams } from "thirdweb/extensions/farcaster";
 * const result = encodeKeyAtParams({
 *  fid: ...,
 *  state: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeKeyAtParams(options: KeyAtParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.fid,
    options.state,
    options.index,
  ]);
}

/**
 * Encodes the "keyAt" function into a Hex string with its parameters.
 * @param options - The options for the keyAt function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeyAt } from "thirdweb/extensions/farcaster";
 * const result = encodeKeyAt({
 *  fid: ...,
 *  state: ...,
 *  index: ...,
 * });
 * ```
 */
export function encodeKeyAt(options: KeyAtParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeKeyAtParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the keyAt function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeyAtResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeyAtResultResult("...");
 * ```
 */
export function decodeKeyAtResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keyAt" function on the contract.
 * @param options - The options for the keyAt function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keyAt } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyAt({
 *  contract,
 *  fid: ...,
 *  state: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function keyAt(options: BaseTransactionOptions<KeyAtParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.state, options.index],
  });
}
