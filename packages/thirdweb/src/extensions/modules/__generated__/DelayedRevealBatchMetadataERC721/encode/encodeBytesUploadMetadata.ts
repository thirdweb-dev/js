import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesUploadMetadata" function.
 */
export type EncodeBytesUploadMetadataParams = {
  encryptedURI: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "encryptedURI";
  }>;
  provenanceHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "provenanceHash";
  }>;
};

export const FN_SELECTOR = "0x479eac8a" as const;
const FN_INPUTS = [
  {
    type: "bytes",
    name: "encryptedURI",
  },
  {
    type: "bytes32",
    name: "provenanceHash",
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesUploadMetadata" function.
 * @param options - The options for the encodeBytesUploadMetadata function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesUploadMetadataParams } "thirdweb/extensions/modules";
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
