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
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "bytes32[]"; name: "recipientAllowlistProof" },
    ];
  }>;
};

export const FN_SELECTOR = "0x819ed5a3" as const;
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
