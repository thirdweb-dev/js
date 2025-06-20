import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintWithSignatureERC20" function.
 */
export type EncodeBytesBeforeMintWithSignatureERC20Params = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "uint48"; name: "startTimestamp" },
      { type: "uint48"; name: "endTimestamp" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
};

export const FN_SELECTOR = "0x76e51eae" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "startTimestamp",
        type: "uint48",
      },
      {
        name: "endTimestamp",
        type: "uint48",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
      },
      {
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "params",
    type: "tuple",
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesBeforeMintWithSignatureERC20" function.
 * @param options - The options for the encodeBytesBeforeMintWithSignatureERC20 function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintWithSignatureERC20Params } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesBeforeMintWithSignatureERC20Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeBytesBeforeMintWithSignatureERC20Params(
  options: EncodeBytesBeforeMintWithSignatureERC20Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}
