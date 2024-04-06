import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "recoveryOf" function.
 */
export type RecoveryOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
};

export const FN_SELECTOR = "0xfa1a1b25" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "recovery",
  },
] as const;

/**
 * Encodes the parameters for the "recoveryOf" function.
 * @param options - The options for the recoveryOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoveryOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeRecoveryOfParams({
 *  fid: ...,
 * });
 * ```
 */
export function encodeRecoveryOfParams(options: RecoveryOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid]);
}

/**
 * Decodes the result of the recoveryOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeRecoveryOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeRecoveryOfResult("...");
 * ```
 */
export function decodeRecoveryOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "recoveryOf" function on the contract.
 * @param options - The options for the recoveryOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { recoveryOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await recoveryOf({
 *  fid: ...,
 * });
 *
 * ```
 */
export async function recoveryOf(
  options: BaseTransactionOptions<RecoveryOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid],
  });
}
