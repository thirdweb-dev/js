import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "canUpdatePack" function.
 */
export type CanUpdatePackParams = {
  key: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_key" }>;
};

export const FN_SELECTOR = "0xb0381b08" as const;
const FN_INPUTS = [
  {
    name: "_key",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `canUpdatePack` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `canUpdatePack` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isCanUpdatePackSupported } from "thirdweb/extensions/pack";
 * const supported = isCanUpdatePackSupported(["0x..."]);
 * ```
 */
export function isCanUpdatePackSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "canUpdatePack" function.
 * @param options - The options for the canUpdatePack function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCanUpdatePackParams } from "thirdweb/extensions/pack";
 * const result = encodeCanUpdatePackParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeCanUpdatePackParams(options: CanUpdatePackParams) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Encodes the "canUpdatePack" function into a Hex string with its parameters.
 * @param options - The options for the canUpdatePack function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeCanUpdatePack } from "thirdweb/extensions/pack";
 * const result = encodeCanUpdatePack({
 *  key: ...,
 * });
 * ```
 */
export function encodeCanUpdatePack(options: CanUpdatePackParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCanUpdatePackParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the canUpdatePack function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeCanUpdatePackResult } from "thirdweb/extensions/pack";
 * const result = decodeCanUpdatePackResultResult("...");
 * ```
 */
export function decodeCanUpdatePackResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "canUpdatePack" function on the contract.
 * @param options - The options for the canUpdatePack function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { canUpdatePack } from "thirdweb/extensions/pack";
 *
 * const result = await canUpdatePack({
 *  contract,
 *  key: ...,
 * });
 *
 * ```
 */
export async function canUpdatePack(
  options: BaseTransactionOptions<CanUpdatePackParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.key],
  });
}
