import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getFollowerProfileId" function.
 */
export type GetFollowerProfileIdParams = {
  followTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followTokenId";
  }>;
};

export const FN_SELECTOR = "0x886a65c3" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "followTokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getFollowerProfileId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getFollowerProfileId` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetFollowerProfileIdSupported } from "thirdweb/extensions/lens";
 *
 * const supported = await isGetFollowerProfileIdSupported(contract);
 * ```
 */
export async function isGetFollowerProfileIdSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getFollowerProfileId" function.
 * @param options - The options for the getFollowerProfileId function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowerProfileIdParams } "thirdweb/extensions/lens";
 * const result = encodeGetFollowerProfileIdParams({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetFollowerProfileIdParams(
  options: GetFollowerProfileIdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.followTokenId]);
}

/**
 * Encodes the "getFollowerProfileId" function into a Hex string with its parameters.
 * @param options - The options for the getFollowerProfileId function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetFollowerProfileId } "thirdweb/extensions/lens";
 * const result = encodeGetFollowerProfileId({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetFollowerProfileId(
  options: GetFollowerProfileIdParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetFollowerProfileIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getFollowerProfileId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetFollowerProfileIdResult } from "thirdweb/extensions/lens";
 * const result = decodeGetFollowerProfileIdResult("...");
 * ```
 */
export function decodeGetFollowerProfileIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getFollowerProfileId" function on the contract.
 * @param options - The options for the getFollowerProfileId function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getFollowerProfileId } from "thirdweb/extensions/lens";
 *
 * const result = await getFollowerProfileId({
 *  contract,
 *  followTokenId: ...,
 * });
 *
 * ```
 */
export async function getFollowerProfileId(
  options: BaseTransactionOptions<GetFollowerProfileIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followTokenId],
  });
}
