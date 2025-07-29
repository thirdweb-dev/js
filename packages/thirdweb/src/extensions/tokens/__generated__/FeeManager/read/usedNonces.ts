import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "usedNonces" function.
 */
export type UsedNoncesParams = {
  signerNonce: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "signerNonce";
  }>;
};

export const FN_SELECTOR = "0xfeb61724" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "signerNonce",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
    name: "used",
  },
] as const;

/**
 * Checks if the `usedNonces` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `usedNonces` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isUsedNoncesSupported } from "thirdweb/extensions/tokens";
 * const supported = isUsedNoncesSupported(["0x..."]);
 * ```
 */
export function isUsedNoncesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "usedNonces" function.
 * @param options - The options for the usedNonces function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeUsedNoncesParams } from "thirdweb/extensions/tokens";
 * const result = encodeUsedNoncesParams({
 *  signerNonce: ...,
 * });
 * ```
 */
export function encodeUsedNoncesParams(options: UsedNoncesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signerNonce]);
}

/**
 * Encodes the "usedNonces" function into a Hex string with its parameters.
 * @param options - The options for the usedNonces function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeUsedNonces } from "thirdweb/extensions/tokens";
 * const result = encodeUsedNonces({
 *  signerNonce: ...,
 * });
 * ```
 */
export function encodeUsedNonces(options: UsedNoncesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUsedNoncesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the usedNonces function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeUsedNoncesResult } from "thirdweb/extensions/tokens";
 * const result = decodeUsedNoncesResultResult("...");
 * ```
 */
export function decodeUsedNoncesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "usedNonces" function on the contract.
 * @param options - The options for the usedNonces function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { usedNonces } from "thirdweb/extensions/tokens";
 *
 * const result = await usedNonces({
 *  contract,
 *  signerNonce: ...,
 * });
 *
 * ```
 */
export async function usedNonces(
  options: BaseTransactionOptions<UsedNoncesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signerNonce],
  });
}
