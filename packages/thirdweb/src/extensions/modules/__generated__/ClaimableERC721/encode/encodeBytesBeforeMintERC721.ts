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
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "bytes32[]"; name: "recipientAllowlistProof" },
    ];
  }>;
};

export const FN_SELECTOR = "0xd9584651" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "currency",
        type: "address",
      },
      {
        name: "pricePerUnit",
        type: "uint256",
      },
      {
        name: "recipientAllowlistProof",
        type: "bytes32[]",
      },
    ],
    name: "params",
    type: "tuple",
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
