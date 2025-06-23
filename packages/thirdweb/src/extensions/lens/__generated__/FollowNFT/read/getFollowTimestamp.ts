import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getFollowTimestamp" function.
 */
export type GetFollowTimestampParams = {
  followTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followTokenId";
  }>;
};

export const FN_SELECTOR = "0x3543a277" as const;
const FN_INPUTS = [
  {
    name: "followTokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getFollowTimestamp` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getFollowTimestamp` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetFollowTimestampSupported } from "thirdweb/extensions/lens";
 * const supported = isGetFollowTimestampSupported(["0x..."]);
 * ```
 */
export function isGetFollowTimestampSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getFollowTimestamp" function.
 * @param options - The options for the getFollowTimestamp function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowTimestampParams } from "thirdweb/extensions/lens";
 * const result = encodeGetFollowTimestampParams({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetFollowTimestampParams(
  options: GetFollowTimestampParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.followTokenId]);
}

/**
 * Encodes the "getFollowTimestamp" function into a Hex string with its parameters.
 * @param options - The options for the getFollowTimestamp function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowTimestamp } from "thirdweb/extensions/lens";
 * const result = encodeGetFollowTimestamp({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetFollowTimestamp(options: GetFollowTimestampParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetFollowTimestampParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getFollowTimestamp function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetFollowTimestampResult } from "thirdweb/extensions/lens";
 * const result = decodeGetFollowTimestampResultResult("...");
 * ```
 */
export function decodeGetFollowTimestampResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getFollowTimestamp" function on the contract.
 * @param options - The options for the getFollowTimestamp function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getFollowTimestamp } from "thirdweb/extensions/lens";
 *
 * const result = await getFollowTimestamp({
 *  contract,
 *  followTokenId: ...,
 * });
 *
 * ```
 */
export async function getFollowTimestamp(
  options: BaseTransactionOptions<GetFollowTimestampParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followTokenId],
  });
}
