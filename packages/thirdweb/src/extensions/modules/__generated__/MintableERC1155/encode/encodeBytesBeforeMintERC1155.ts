import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintERC1155" function.
 */
export type EncodeBytesBeforeMintERC1155Params = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      {
        type: "tuple";
        name: "request";
        components: [
          { type: "uint256"; name: "tokenId" },
          { type: "uint48"; name: "startTimestamp" },
          { type: "uint48"; name: "endTimestamp" },
          { type: "address"; name: "recipient" },
          { type: "uint256"; name: "quantity" },
          { type: "address"; name: "currency" },
          { type: "uint256"; name: "pricePerUnit" },
          { type: "string"; name: "metadataURI" },
          { type: "bytes32"; name: "uid" },
        ];
      },
      { type: "bytes"; name: "signature" },
      { type: "string"; name: "metadataURI" },
    ];
  }>;
};

export const FN_SELECTOR = "0xa4c6930f" as const;
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
            type: "uint256",
            name: "tokenId",
          },
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
            name: "metadataURI",
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
        name: "metadataURI",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "encodeBytesBeforeMintERC1155" function.
 * @param options - The options for the encodeBytesBeforeMintERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC1155Params } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesBeforeMintERC1155Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeBytesBeforeMintERC1155Params(
  options: EncodeBytesBeforeMintERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}
