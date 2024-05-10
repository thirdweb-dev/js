import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    type: "address",
    name: "_tokenOwner",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "score",
  },
] as const;

/**
 * Checks if the `getScore` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getScore` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetScoreSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = await isGetScoreSupported(contract);
 * ```
 */
export async function isGetScoreSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { encodeGetScoreParams } "thirdweb/extensions/thirdweb";
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
 * import { encodeGetScore } "thirdweb/extensions/thirdweb";
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
 * const result = decodeGetScoreResult("...");
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
