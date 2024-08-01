import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
export function encodeBytesUploadMetadataParams(
  options: EncodeBytesUploadMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.encryptedURI,
    options.provenanceHash,
  ]);
}
