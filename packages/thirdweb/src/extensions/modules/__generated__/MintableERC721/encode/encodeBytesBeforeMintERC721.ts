import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintERC721" function.
 */
export type EncodeBytesBeforeMintERC721Params = {
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
          { type: "string"; name: "baseURI" },
          { type: "bytes32"; name: "uid" },
        ];
      },
      { type: "bytes"; name: "signature" },
      { type: "string"; name: "baseURI" },
    ];
  }>;
};

export const FN_SELECTOR = "0x47404aa5" as const;
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
            type: "string",
            name: "baseURI",
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
      {
        type: "string",
        name: "baseURI",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesBeforeMintERC721" function.
 * @param options - The options for the encodeBytesBeforeMintERC721 function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC721Params } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesBeforeMintERC721Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeBytesBeforeMintERC721Params(
  options: EncodeBytesBeforeMintERC721Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}
