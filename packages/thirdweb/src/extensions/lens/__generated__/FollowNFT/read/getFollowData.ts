import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getFollowData" function.
 */
export type GetFollowDataParams = {
  followTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followTokenId";
  }>;
};

export const FN_SELECTOR = "0xd6cbec5d" as const;
const FN_INPUTS = [
  {
    name: "followTokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "followerProfileId",
        type: "uint160",
      },
      {
        name: "originalFollowTimestamp",
        type: "uint48",
      },
      {
        name: "followTimestamp",
        type: "uint48",
      },
      {
        name: "profileIdAllowedToRecover",
        type: "uint256",
      },
    ],
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getFollowData` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getFollowData` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetFollowDataSupported } from "thirdweb/extensions/lens";
 * const supported = isGetFollowDataSupported(["0x..."]);
 * ```
 */
export function isGetFollowDataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getFollowData" function.
 * @param options - The options for the getFollowData function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowDataParams } from "thirdweb/extensions/lens";
 * const result = encodeGetFollowDataParams({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetFollowDataParams(options: GetFollowDataParams) {
  return encodeAbiParameters(FN_INPUTS, [options.followTokenId]);
}

/**
 * Encodes the "getFollowData" function into a Hex string with its parameters.
 * @param options - The options for the getFollowData function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowData } from "thirdweb/extensions/lens";
 * const result = encodeGetFollowData({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetFollowData(options: GetFollowDataParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetFollowDataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getFollowData function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetFollowDataResult } from "thirdweb/extensions/lens";
 * const result = decodeGetFollowDataResultResult("...");
 * ```
 */
export function decodeGetFollowDataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getFollowData" function on the contract.
 * @param options - The options for the getFollowData function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getFollowData } from "thirdweb/extensions/lens";
 *
 * const result = await getFollowData({
 *  contract,
 *  followTokenId: ...,
 * });
 *
 * ```
 */
export async function getFollowData(
  options: BaseTransactionOptions<GetFollowDataParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followTokenId],
  });
}
