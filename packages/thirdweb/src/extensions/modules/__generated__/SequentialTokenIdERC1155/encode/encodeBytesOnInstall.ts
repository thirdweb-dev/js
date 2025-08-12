import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
  startTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "startTokenId";
  }>;
};

export const FN_SELECTOR = "0x579a6021" as const;
const FN_INPUTS = [
  {
    name: "startTokenId",
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesOnInstall" function.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesOnInstallParams } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesOnInstallParams({
 *  startTokenId: ...,
 * });
 * ```
 */
export function encodeBytesOnInstallParams(
  options: EncodeBytesOnInstallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.startTokenId]);
}
