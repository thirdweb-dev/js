import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    name: "royaltyRecipient";
    type: "address";
    internalType: "address";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    name: "royaltyBps";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x9adb1e41" as const;
const FN_INPUTS = [
  {
    name: "royaltyRecipient",
    type: "address",
    internalType: "address",
  },
  {
    name: "royaltyBps",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesOnInstall" function.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesOnInstallParams } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesOnInstallParams({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 * ```
 */
export function encodeBytesOnInstallParams(
  options: EncodeBytesOnInstallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.royaltyRecipient,
    options.royaltyBps,
  ]);
}
