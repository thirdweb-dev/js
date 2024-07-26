import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getFollowTokenId" function.
 */
export type GetFollowTokenIdParams = {
  followerProfileId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followerProfileId";
  }>;
};

export const FN_SELECTOR = "0x11c763d6" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "followerProfileId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getFollowTokenId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getFollowTokenId` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetFollowTokenIdSupported } from "thirdweb/extensions/lens";
 *
 * const supported = await isGetFollowTokenIdSupported(contract);
 * ```
 */
export async function isGetFollowTokenIdSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getFollowTokenId" function.
 * @param options - The options for the getFollowTokenId function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowTokenIdParams } "thirdweb/extensions/lens";
 * const result = encodeGetFollowTokenIdParams({
 *  followerProfileId: ...,
 * });
 * ```
 */
export function encodeGetFollowTokenIdParams(options: GetFollowTokenIdParams) {
  return encodeAbiParameters(FN_INPUTS, [options.followerProfileId]);
}

/**
 * Encodes the "getFollowTokenId" function into a Hex string with its parameters.
 * @param options - The options for the getFollowTokenId function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowTokenId } "thirdweb/extensions/lens";
 * const result = encodeGetFollowTokenId({
 *  followerProfileId: ...,
 * });
 * ```
 */
export function encodeGetFollowTokenId(options: GetFollowTokenIdParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetFollowTokenIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getFollowTokenId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetFollowTokenIdResult } from "thirdweb/extensions/lens";
 * const result = decodeGetFollowTokenIdResult("...");
 * ```
 */
export function decodeGetFollowTokenIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getFollowTokenId" function on the contract.
 * @param options - The options for the getFollowTokenId function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getFollowTokenId } from "thirdweb/extensions/lens";
 *
 * const result = await getFollowTokenId({
 *  contract,
 *  followerProfileId: ...,
 * });
 *
 * ```
 */
export async function getFollowTokenId(
  options: BaseTransactionOptions<GetFollowTokenIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followerProfileId],
  });
}
