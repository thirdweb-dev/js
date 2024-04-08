import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "keyDataOf" function.
 */
export type KeyDataOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
};

export const FN_SELECTOR = "0xac34cc5a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "bytes",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "keyDataOf" function.
 * @param options - The options for the keyDataOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeyDataOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeKeyDataOfParams({
 *  fid: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeKeyDataOfParams(options: KeyDataOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.key]);
}

/**
 * Decodes the result of the keyDataOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeyDataOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeyDataOfResult("...");
 * ```
 */
export function decodeKeyDataOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keyDataOf" function on the contract.
 * @param options - The options for the keyDataOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keyDataOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyDataOf({
 *  fid: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function keyDataOf(
  options: BaseTransactionOptions<KeyDataOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.key],
  });
}
