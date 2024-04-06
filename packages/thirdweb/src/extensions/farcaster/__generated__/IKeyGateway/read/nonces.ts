import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "nonces" function.
 */
export type NoncesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x7ecebe00" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "nonces" function.
 * @param options - The options for the nonces function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeNoncesParams } "thirdweb/extensions/farcaster";
 * const result = encodeNoncesParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeNoncesParams(options: NoncesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Decodes the result of the nonces function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeNoncesResult } from "thirdweb/extensions/farcaster";
 * const result = decodeNoncesResult("...");
 * ```
 */
export function decodeNoncesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "nonces" function on the contract.
 * @param options - The options for the nonces function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { nonces } from "thirdweb/extensions/farcaster";
 *
 * const result = await nonces({
 *  account: ...,
 * });
 *
 * ```
 */
export async function nonces(options: BaseTransactionOptions<NoncesParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
