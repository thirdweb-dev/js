import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintERC20" function.
 */
export type EncodeBytesBeforeMintERC20Params = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      {
        type: "tuple";
        name: "request";
        components: [
          { type: "uint48"; name: "startTimestamp" },
          { type: "uint48"; name: "endTimestamp" },
          { type: "address"; name: "recipient" },
          { type: "uint256"; name: "quantity" },
          { type: "address"; name: "currency" },
          { type: "uint256"; name: "pricePerUnit" },
          { type: "bytes32"; name: "uid" },
        ];
      },
      { type: "bytes"; name: "signature" },
    ];
  }>;
};

export const FN_SELECTOR = "0xc7a090f4" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "tuple",
        name: "request",
        components: [
          {
            type: "uint48",
            name: "startTimestamp",
          },
          {
            type: "uint48",
            name: "endTimestamp",
          },
          {
            type: "address",
            name: "recipient",
          },
          {
            type: "uint256",
            name: "quantity",
          },
          {
            type: "address",
            name: "currency",
          },
          {
            type: "uint256",
            name: "pricePerUnit",
          },
          {
            type: "bytes32",
            name: "uid",
          },
        ],
      },
      {
        type: "bytes",
        name: "signature",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesBeforeMintERC20" function.
 * @param options - The options for the encodeBytesBeforeMintERC20 function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC20Params } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesBeforeMintERC20Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeBytesBeforeMintERC20Params(
  options: EncodeBytesBeforeMintERC20Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}
