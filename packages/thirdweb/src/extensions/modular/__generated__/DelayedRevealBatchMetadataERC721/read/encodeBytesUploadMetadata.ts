import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "encodeBytesUploadMetadata" function.
 */
export type EncodeBytesUploadMetadataParams = {
  encryptedURI: AbiParameterToPrimitiveType<{
    name: "encryptedURI";
    type: "bytes";
    internalType: "bytes";
  }>;
  provenanceHash: AbiParameterToPrimitiveType<{
    name: "provenanceHash";
    type: "bytes32";
    internalType: "bytes32";
  }>;
};

export const FN_SELECTOR = "0x479eac8a" as const;
const FN_INPUTS = [
  {
    name: "encryptedURI",
    type: "bytes",
    internalType: "bytes",
  },
  {
    name: "provenanceHash",
    type: "bytes32",
    internalType: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes",
    internalType: "bytes",
  },
] as const;

/**
 * Checks if the `encodeBytesUploadMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `encodeBytesUploadMetadata` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEncodeBytesUploadMetadataSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isEncodeBytesUploadMetadataSupported(["0x..."]);
 * ```
 */
export function isEncodeBytesUploadMetadataSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "encodeBytesUploadMetadata" function.
 * @param options - The options for the encodeBytesUploadMetadata function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesUploadMetadataParams } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesUploadMetadataParams({
 *  encryptedURI: ...,
 *  provenanceHash: ...,
 * });
 * ```
 */
export function encodeEncodeBytesUploadMetadataParams(
  options: EncodeBytesUploadMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.encryptedURI,
    options.provenanceHash,
  ]);
}

/**
 * Encodes the "encodeBytesUploadMetadata" function into a Hex string with its parameters.
 * @param options - The options for the encodeBytesUploadMetadata function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesUploadMetadata } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesUploadMetadata({
 *  encryptedURI: ...,
 *  provenanceHash: ...,
 * });
 * ```
 */
export function encodeEncodeBytesUploadMetadata(
  options: EncodeBytesUploadMetadataParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEncodeBytesUploadMetadataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the encodeBytesUploadMetadata function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEncodeBytesUploadMetadataResult } from "thirdweb/extensions/modular";
 * const result = decodeEncodeBytesUploadMetadataResult("...");
 * ```
 */
export function decodeEncodeBytesUploadMetadataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesUploadMetadata" function on the contract.
 * @param options - The options for the encodeBytesUploadMetadata function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBytesUploadMetadata } from "thirdweb/extensions/modular";
 *
 * const result = await encodeBytesUploadMetadata({
 *  contract,
 *  encryptedURI: ...,
 *  provenanceHash: ...,
 * });
 *
 * ```
 */
export async function encodeBytesUploadMetadata(
  options: BaseTransactionOptions<EncodeBytesUploadMetadataParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.encryptedURI, options.provenanceHash],
  });
}
