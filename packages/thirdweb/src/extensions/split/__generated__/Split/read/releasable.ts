import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "releasable" function.
 */
export type ReleasableParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0xa3f8eace" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `releasable` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `releasable` method is supported.
 * @extension SPLIT
 * @example
 * ```ts
 * import { isReleasableSupported } from "thirdweb/extensions/split";
 * const supported = isReleasableSupported(["0x..."]);
 * ```
 */
export function isReleasableSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "releasable" function.
 * @param options - The options for the releasable function.
 * @returns The encoded ABI parameters.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodeReleasableParams } from "thirdweb/extensions/split";
 * const result = encodeReleasableParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeReleasableParams(options: ReleasableParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "releasable" function into a Hex string with its parameters.
 * @param options - The options for the releasable function.
 * @returns The encoded hexadecimal string.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodeReleasable } from "thirdweb/extensions/split";
 * const result = encodeReleasable({
 *  account: ...,
 * });
 * ```
 */
export function encodeReleasable(options: ReleasableParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeReleasableParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the releasable function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension SPLIT
 * @example
 * ```ts
 * import { decodeReleasableResult } from "thirdweb/extensions/split";
 * const result = decodeReleasableResultResult("...");
 * ```
 */
export function decodeReleasableResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "releasable" function on the contract.
 * @param options - The options for the releasable function.
 * @returns The parsed result of the function call.
 * @extension SPLIT
 * @example
 * ```ts
 * import { releasable } from "thirdweb/extensions/split";
 *
 * const result = await releasable({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function releasable(
  options: BaseTransactionOptions<ReleasableParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
