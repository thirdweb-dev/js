import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "totalKeys" function.
 */
export type TotalKeysParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
};

export const FN_SELECTOR = "0x6840b75e" as const;
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
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "totalKeys" function.
 * @param options - The options for the totalKeys function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTotalKeysParams } "thirdweb/extensions/farcaster";
 * const result = encodeTotalKeysParams({
 *  fid: ...,
 *  state: ...,
 * });
 * ```
 */
export function encodeTotalKeysParams(options: TotalKeysParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.state]);
}

/**
 * Decodes the result of the totalKeys function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeTotalKeysResult } from "thirdweb/extensions/farcaster";
 * const result = decodeTotalKeysResult("...");
 * ```
 */
export function decodeTotalKeysResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalKeys" function on the contract.
 * @param options - The options for the totalKeys function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { totalKeys } from "thirdweb/extensions/farcaster";
 *
 * const result = await totalKeys({
 *  fid: ...,
 *  state: ...,
 * });
 *
 * ```
 */
export async function totalKeys(
  options: BaseTransactionOptions<TotalKeysParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.state],
  });
}
