import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isFollowing" function.
 */
export type IsFollowingParams = {
  followerProfileId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followerProfileId";
  }>;
};

export const FN_SELECTOR = "0x4d71688d" as const;
const FN_INPUTS = [
  {
    name: "followerProfileId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isFollowing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isFollowing` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isIsFollowingSupported } from "thirdweb/extensions/lens";
 * const supported = isIsFollowingSupported(["0x..."]);
 * ```
 */
export function isIsFollowingSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isFollowing" function.
 * @param options - The options for the isFollowing function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsFollowingParams } from "thirdweb/extensions/lens";
 * const result = encodeIsFollowingParams({
 *  followerProfileId: ...,
 * });
 * ```
 */
export function encodeIsFollowingParams(options: IsFollowingParams) {
  return encodeAbiParameters(FN_INPUTS, [options.followerProfileId]);
}

/**
 * Encodes the "isFollowing" function into a Hex string with its parameters.
 * @param options - The options for the isFollowing function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsFollowing } from "thirdweb/extensions/lens";
 * const result = encodeIsFollowing({
 *  followerProfileId: ...,
 * });
 * ```
 */
export function encodeIsFollowing(options: IsFollowingParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsFollowingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isFollowing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeIsFollowingResult } from "thirdweb/extensions/lens";
 * const result = decodeIsFollowingResultResult("...");
 * ```
 */
export function decodeIsFollowingResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isFollowing" function on the contract.
 * @param options - The options for the isFollowing function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { isFollowing } from "thirdweb/extensions/lens";
 *
 * const result = await isFollowing({
 *  contract,
 *  followerProfileId: ...,
 * });
 *
 * ```
 */
export async function isFollowing(
  options: BaseTransactionOptions<IsFollowingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followerProfileId],
  });
}
