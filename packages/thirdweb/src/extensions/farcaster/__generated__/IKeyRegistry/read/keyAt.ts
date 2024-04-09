import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "uint256",
    name: "fid",
  },
  {
    type: "uint8",
    name: "state",
  },
  {
    type: "uint256",
    name: "index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Encodes the parameters for the "keyAt" function.
 * @param options - The options for the keyAt function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeyAtParams } "thirdweb/extensions/farcaster";
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
 * Decodes the result of the keyAt function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeyAtResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeyAtResult("...");
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
