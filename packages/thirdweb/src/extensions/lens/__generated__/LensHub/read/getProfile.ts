import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getProfile" function.
 */
export type GetProfileParams = {
  profileId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "profileId";
  }>;
};

export const FN_SELECTOR = "0xf08f4f64" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "profileId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    components: [
      {
        type: "uint256",
        name: "pubCount",
      },
      {
        type: "address",
        name: "followModule",
      },
      {
        type: "address",
        name: "followNFT",
      },
      {
        type: "string",
        name: "__DEPRECATED__handle",
      },
      {
        type: "string",
        name: "__DEPRECATED__imageURI",
      },
      {
        type: "string",
        name: "__DEPRECATED__followNFTURI",
      },
      {
        type: "string",
        name: "metadataURI",
      },
    ],
  },
] as const;

/**
 * Checks if the `getProfile` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getProfile` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetProfileSupported } from "thirdweb/extensions/lens";
 * const supported = isGetProfileSupported(["0x..."]);
 * ```
 */
export function isGetProfileSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getProfile" function.
 * @param options - The options for the getProfile function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetProfileParams } from "thirdweb/extensions/lens";
 * const result = encodeGetProfileParams({
 *  profileId: ...,
 * });
 * ```
 */
export function encodeGetProfileParams(options: GetProfileParams) {
  return encodeAbiParameters(FN_INPUTS, [options.profileId]);
}

/**
 * Encodes the "getProfile" function into a Hex string with its parameters.
 * @param options - The options for the getProfile function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetProfile } from "thirdweb/extensions/lens";
 * const result = encodeGetProfile({
 *  profileId: ...,
 * });
 * ```
 */
export function encodeGetProfile(options: GetProfileParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetProfileParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getProfile function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetProfileResult } from "thirdweb/extensions/lens";
 * const result = decodeGetProfileResultResult("...");
 * ```
 */
export function decodeGetProfileResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getProfile" function on the contract.
 * @param options - The options for the getProfile function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getProfile } from "thirdweb/extensions/lens";
 *
 * const result = await getProfile({
 *  contract,
 *  profileId: ...,
 * });
 *
 * ```
 */
export async function getProfile(
  options: BaseTransactionOptions<GetProfileParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.profileId],
  });
}
