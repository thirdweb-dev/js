import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getProfileIdByHandleHash" function.
 */
export type GetProfileIdByHandleHashParams = {
  handleHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "handleHash";
  }>;
};

export const FN_SELECTOR = "0x19e14070" as const;
const FN_INPUTS = [
  {
    name: "handleHash",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getProfileIdByHandleHash` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getProfileIdByHandleHash` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetProfileIdByHandleHashSupported } from "thirdweb/extensions/lens";
 * const supported = isGetProfileIdByHandleHashSupported(["0x..."]);
 * ```
 */
export function isGetProfileIdByHandleHashSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getProfileIdByHandleHash" function.
 * @param options - The options for the getProfileIdByHandleHash function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetProfileIdByHandleHashParams } from "thirdweb/extensions/lens";
 * const result = encodeGetProfileIdByHandleHashParams({
 *  handleHash: ...,
 * });
 * ```
 */
export function encodeGetProfileIdByHandleHashParams(
  options: GetProfileIdByHandleHashParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.handleHash]);
}

/**
 * Encodes the "getProfileIdByHandleHash" function into a Hex string with its parameters.
 * @param options - The options for the getProfileIdByHandleHash function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetProfileIdByHandleHash } from "thirdweb/extensions/lens";
 * const result = encodeGetProfileIdByHandleHash({
 *  handleHash: ...,
 * });
 * ```
 */
export function encodeGetProfileIdByHandleHash(
  options: GetProfileIdByHandleHashParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetProfileIdByHandleHashParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getProfileIdByHandleHash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetProfileIdByHandleHashResult } from "thirdweb/extensions/lens";
 * const result = decodeGetProfileIdByHandleHashResultResult("...");
 * ```
 */
export function decodeGetProfileIdByHandleHashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getProfileIdByHandleHash" function on the contract.
 * @param options - The options for the getProfileIdByHandleHash function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getProfileIdByHandleHash } from "thirdweb/extensions/lens";
 *
 * const result = await getProfileIdByHandleHash({
 *  contract,
 *  handleHash: ...,
 * });
 *
 * ```
 */
export async function getProfileIdByHandleHash(
  options: BaseTransactionOptions<GetProfileIdByHandleHashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.handleHash],
  });
}
