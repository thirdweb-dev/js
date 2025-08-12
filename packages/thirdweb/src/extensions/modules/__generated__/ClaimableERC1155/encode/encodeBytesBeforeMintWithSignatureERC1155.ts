import type { AbiParameterToPrimitiveType } from "abitype";

import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintWithSignatureERC1155" function.
 */
export type EncodeBytesBeforeMintWithSignatureERC1155Params = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "uint48"; name: "startTimestamp" },
      { type: "uint48"; name: "endTimestamp" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "maxMintPerWallet" },
      { type: "uint256"; name: "pricePerUnit" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
};

export const FN_SELECTOR = "0x63dacad2" as const;
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
        name: "maxMintPerWallet",
        type: "uint256",
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
 * Encodes the parameters for the "encodeBytesBeforeMintWithSignatureERC1155" function.
 * @param options - The options for the encodeBytesBeforeMintWithSignatureERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintWithSignatureERC1155Params } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesBeforeMintWithSignatureERC1155Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeBytesBeforeMintWithSignatureERC1155Params(
  options: EncodeBytesBeforeMintWithSignatureERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}
