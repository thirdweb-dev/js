import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "fid",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "recovery",
    type: "address",
  },
] as const;

/**
 * Checks if the `recoveryOf` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `recoveryOf` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRecoveryOfSupported } from "thirdweb/extensions/farcaster";
 * const supported = isRecoveryOfSupported(["0x..."]);
 * ```
 */
export function isRecoveryOfSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "recoveryOf" function.
 * @param options - The options for the recoveryOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoveryOfParams } from "thirdweb/extensions/farcaster";
 * const result = encodeRecoveryOfParams({
 *  fid: ...,
 * });
 * ```
 */
export function encodeRecoveryOfParams(options: RecoveryOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid]);
}

/**
 * Encodes the "recoveryOf" function into a Hex string with its parameters.
 * @param options - The options for the recoveryOf function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoveryOf } from "thirdweb/extensions/farcaster";
 * const result = encodeRecoveryOf({
 *  fid: ...,
 * });
 * ```
 */
export function encodeRecoveryOf(options: RecoveryOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRecoveryOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the recoveryOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeRecoveryOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeRecoveryOfResultResult("...");
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
 *  contract,
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
