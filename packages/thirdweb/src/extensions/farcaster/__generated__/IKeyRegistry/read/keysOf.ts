import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "keysOf" function.
 */
export type KeysOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
};

export const FN_SELECTOR = "0x1f64222f" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "uint8",
    name: "state",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes[]",
  },
] as const;

/**
 * Encodes the parameters for the "keysOf" function.
 * @param options - The options for the keysOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeysOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeKeysOfParams({
 *  fid: ...,
 *  state: ...,
 * });
 * ```
 */
export function encodeKeysOfParams(options: KeysOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.state]);
}

/**
 * Decodes the result of the keysOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeysOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeysOfResult("...");
 * ```
 */
export function decodeKeysOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keysOf" function on the contract.
 * @param options - The options for the keysOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keysOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await keysOf({
 *  fid: ...,
 *  state: ...,
 * });
 *
 * ```
 */
export async function keysOf(options: BaseTransactionOptions<KeysOfParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.state],
  });
}
