import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "released" function.
 */
export type ReleasedParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x9852595c" as const;
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
 * Checks if the `released` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `released` method is supported.
 * @extension SPLIT
 * @example
 * ```ts
 * import { isReleasedSupported } from "thirdweb/extensions/split";
 * const supported = isReleasedSupported(["0x..."]);
 * ```
 */
export function isReleasedSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "released" function.
 * @param options - The options for the released function.
 * @returns The encoded ABI parameters.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodeReleasedParams } from "thirdweb/extensions/split";
 * const result = encodeReleasedParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeReleasedParams(options: ReleasedParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "released" function into a Hex string with its parameters.
 * @param options - The options for the released function.
 * @returns The encoded hexadecimal string.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodeReleased } from "thirdweb/extensions/split";
 * const result = encodeReleased({
 *  account: ...,
 * });
 * ```
 */
export function encodeReleased(options: ReleasedParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeReleasedParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the released function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension SPLIT
 * @example
 * ```ts
 * import { decodeReleasedResult } from "thirdweb/extensions/split";
 * const result = decodeReleasedResultResult("...");
 * ```
 */
export function decodeReleasedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "released" function on the contract.
 * @param options - The options for the released function.
 * @returns The parsed result of the function call.
 * @extension SPLIT
 * @example
 * ```ts
 * import { released } from "thirdweb/extensions/split";
 *
 * const result = await released({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function released(
  options: BaseTransactionOptions<ReleasedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
