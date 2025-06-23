import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
  primarySaleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "primarySaleRecipient";
  }>;
};

export const FN_SELECTOR = "0x5d4c0b89" as const;
const FN_INPUTS = [
  {
    name: "primarySaleRecipient",
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
 *  primarySaleRecipient: ...,
 * });
 * ```
 */
export function encodeBytesOnInstallParams(
  options: EncodeBytesOnInstallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.primarySaleRecipient]);
}
