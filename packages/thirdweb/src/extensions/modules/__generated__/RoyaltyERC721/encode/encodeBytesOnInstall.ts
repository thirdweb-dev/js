import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "royaltyRecipient";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    type: "uint16";
    name: "royaltyBps";
  }>;
  transferValidator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "transferValidator";
  }>;
};

export const FN_SELECTOR = "0x2fbb2623" as const;
const FN_INPUTS = [
  {
    name: "royaltyRecipient",
    type: "address",
  },
  {
    name: "royaltyBps",
    type: "uint16",
  },
  {
    name: "transferValidator",
    type: "address",
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
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 *  transferValidator: ...,
 * });
 * ```
 */
export function encodeBytesOnInstallParams(
  options: EncodeBytesOnInstallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.royaltyRecipient,
    options.royaltyBps,
    options.transferValidator,
  ]);
}
