import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getProfileIdAllowedToRecover" function.
 */
export type GetProfileIdAllowedToRecoverParams = {
  followTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followTokenId";
  }>;
};

export const FN_SELECTOR = "0x2af1544f" as const;
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
 * Checks if the `getProfileIdAllowedToRecover` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getProfileIdAllowedToRecover` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetProfileIdAllowedToRecoverSupported } from "thirdweb/extensions/lens";
 *
 * const supported = await isGetProfileIdAllowedToRecoverSupported(contract);
 * ```
 */
export async function isGetProfileIdAllowedToRecoverSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getProfileIdAllowedToRecover" function.
 * @param options - The options for the getProfileIdAllowedToRecover function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetProfileIdAllowedToRecoverParams } "thirdweb/extensions/lens";
 * const result = encodeGetProfileIdAllowedToRecoverParams({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetProfileIdAllowedToRecoverParams(
  options: GetProfileIdAllowedToRecoverParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.followTokenId]);
}

/**
 * Encodes the "getProfileIdAllowedToRecover" function into a Hex string with its parameters.
 * @param options - The options for the getProfileIdAllowedToRecover function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetProfileIdAllowedToRecover } "thirdweb/extensions/lens";
 * const result = encodeGetProfileIdAllowedToRecover({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetProfileIdAllowedToRecover(
  options: GetProfileIdAllowedToRecoverParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetProfileIdAllowedToRecoverParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getProfileIdAllowedToRecover function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetProfileIdAllowedToRecoverResult } from "thirdweb/extensions/lens";
 * const result = decodeGetProfileIdAllowedToRecoverResult("...");
 * ```
 */
export function decodeGetProfileIdAllowedToRecoverResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getProfileIdAllowedToRecover" function on the contract.
 * @param options - The options for the getProfileIdAllowedToRecover function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getProfileIdAllowedToRecover } from "thirdweb/extensions/lens";
 *
 * const result = await getProfileIdAllowedToRecover({
 *  contract,
 *  followTokenId: ...,
 * });
 *
 * ```
 */
export async function getProfileIdAllowedToRecover(
  options: BaseTransactionOptions<GetProfileIdAllowedToRecoverParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followTokenId],
  });
}
