import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "custodyOf" function.
 */
export type CustodyOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
};

export const FN_SELECTOR = "0x65269e47" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "owner",
  },
] as const;

/**
 * Encodes the parameters for the "custodyOf" function.
 * @param options - The options for the custodyOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeCustodyOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeCustodyOfParams({
 *  fid: ...,
 * });
 * ```
 */
export function encodeCustodyOfParams(options: CustodyOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid]);
}

/**
 * Decodes the result of the custodyOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeCustodyOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeCustodyOfResult("...");
 * ```
 */
export function decodeCustodyOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "custodyOf" function on the contract.
 * @param options - The options for the custodyOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { custodyOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await custodyOf({
 *  fid: ...,
 * });
 *
 * ```
 */
export async function custodyOf(
  options: BaseTransactionOptions<CustodyOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid],
  });
}
