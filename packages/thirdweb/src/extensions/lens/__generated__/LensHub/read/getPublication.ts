import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPublication" function.
 */
export type GetPublicationParams = {
  profileId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "profileId";
  }>;
  pubId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "pubId" }>;
};

export const FN_SELECTOR = "0x7385ebc9" as const;
const FN_INPUTS = [
  {
    name: "profileId",
    type: "uint256",
  },
  {
    name: "pubId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "pointedProfileId",
        type: "uint256",
      },
      {
        name: "pointedPubId",
        type: "uint256",
      },
      {
        name: "contentURI",
        type: "string",
      },
      {
        name: "referenceModule",
        type: "address",
      },
      {
        name: "__DEPRECATED__collectModule",
        type: "address",
      },
      {
        name: "__DEPRECATED__collectNFT",
        type: "address",
      },
      {
        name: "pubType",
        type: "uint8",
      },
      {
        name: "rootProfileId",
        type: "uint256",
      },
      {
        name: "rootPubId",
        type: "uint256",
      },
    ],
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getPublication` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPublication` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetPublicationSupported } from "thirdweb/extensions/lens";
 * const supported = isGetPublicationSupported(["0x..."]);
 * ```
 */
export function isGetPublicationSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPublication" function.
 * @param options - The options for the getPublication function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetPublicationParams } from "thirdweb/extensions/lens";
 * const result = encodeGetPublicationParams({
 *  profileId: ...,
 *  pubId: ...,
 * });
 * ```
 */
export function encodeGetPublicationParams(options: GetPublicationParams) {
  return encodeAbiParameters(FN_INPUTS, [options.profileId, options.pubId]);
}

/**
 * Encodes the "getPublication" function into a Hex string with its parameters.
 * @param options - The options for the getPublication function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetPublication } from "thirdweb/extensions/lens";
 * const result = encodeGetPublication({
 *  profileId: ...,
 *  pubId: ...,
 * });
 * ```
 */
export function encodeGetPublication(options: GetPublicationParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPublicationParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPublication function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetPublicationResult } from "thirdweb/extensions/lens";
 * const result = decodeGetPublicationResultResult("...");
 * ```
 */
export function decodeGetPublicationResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPublication" function on the contract.
 * @param options - The options for the getPublication function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getPublication } from "thirdweb/extensions/lens";
 *
 * const result = await getPublication({
 *  contract,
 *  profileId: ...,
 *  pubId: ...,
 * });
 *
 * ```
 */
export async function getPublication(
  options: BaseTransactionOptions<GetPublicationParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.profileId, options.pubId],
  });
}
