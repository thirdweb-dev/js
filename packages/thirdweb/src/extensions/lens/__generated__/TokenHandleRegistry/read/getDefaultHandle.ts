import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getDefaultHandle" function.
 */
export type GetDefaultHandleParams = {
  profileId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "profileId";
  }>;
};

export const FN_SELECTOR = "0xe524488d" as const;
const FN_INPUTS = [
  {
    name: "profileId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getDefaultHandle` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getDefaultHandle` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetDefaultHandleSupported } from "thirdweb/extensions/lens";
 * const supported = isGetDefaultHandleSupported(["0x..."]);
 * ```
 */
export function isGetDefaultHandleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getDefaultHandle" function.
 * @param options - The options for the getDefaultHandle function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetDefaultHandleParams } from "thirdweb/extensions/lens";
 * const result = encodeGetDefaultHandleParams({
 *  profileId: ...,
 * });
 * ```
 */
export function encodeGetDefaultHandleParams(options: GetDefaultHandleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.profileId]);
}

/**
 * Encodes the "getDefaultHandle" function into a Hex string with its parameters.
 * @param options - The options for the getDefaultHandle function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetDefaultHandle } from "thirdweb/extensions/lens";
 * const result = encodeGetDefaultHandle({
 *  profileId: ...,
 * });
 * ```
 */
export function encodeGetDefaultHandle(options: GetDefaultHandleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetDefaultHandleParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getDefaultHandle function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetDefaultHandleResult } from "thirdweb/extensions/lens";
 * const result = decodeGetDefaultHandleResultResult("...");
 * ```
 */
export function decodeGetDefaultHandleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getDefaultHandle" function on the contract.
 * @param options - The options for the getDefaultHandle function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getDefaultHandle } from "thirdweb/extensions/lens";
 *
 * const result = await getDefaultHandle({
 *  contract,
 *  profileId: ...,
 * });
 *
 * ```
 */
export async function getDefaultHandle(
  options: BaseTransactionOptions<GetDefaultHandleParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.profileId],
  });
}
