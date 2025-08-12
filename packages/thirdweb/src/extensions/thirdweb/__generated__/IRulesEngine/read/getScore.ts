import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getScore" function.
 */
export type GetScoreParams = {
  tokenOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_tokenOwner";
  }>;
};

export const FN_SELECTOR = "0xd47875d0" as const;
const FN_INPUTS = [
  {
    name: "_tokenOwner",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "score",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getScore` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getScore` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetScoreSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetScoreSupported(["0x..."]);
 * ```
 */
export function isGetScoreSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getScore" function.
 * @param options - The options for the getScore function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetScoreParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetScoreParams({
 *  tokenOwner: ...,
 * });
 * ```
 */
export function encodeGetScoreParams(options: GetScoreParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenOwner]);
}

/**
 * Encodes the "getScore" function into a Hex string with its parameters.
 * @param options - The options for the getScore function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetScore } from "thirdweb/extensions/thirdweb";
 * const result = encodeGetScore({
 *  tokenOwner: ...,
 * });
 * ```
 */
export function encodeGetScore(options: GetScoreParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetScoreParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getScore function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetScoreResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetScoreResultResult("...");
 * ```
 */
export function decodeGetScoreResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getScore" function on the contract.
 * @param options - The options for the getScore function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getScore } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getScore({
 *  contract,
 *  tokenOwner: ...,
 * });
 *
 * ```
 */
export async function getScore(
  options: BaseTransactionOptions<GetScoreParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenOwner],
  });
}
