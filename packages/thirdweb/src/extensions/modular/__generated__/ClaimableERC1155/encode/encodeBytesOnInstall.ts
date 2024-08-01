import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
  primarySaleRecipient: AbiParameterToPrimitiveType<{
    name: "primarySaleRecipient";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0x5d4c0b89" as const;
const FN_INPUTS = [
  {
    name: "primarySaleRecipient",
    type: "address",
    internalType: "address",
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
 *  primarySaleRecipient: ...,
 * });
 * ```
 */
export function encodeBytesOnInstallParams(
  options: EncodeBytesOnInstallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.primarySaleRecipient]);
}
