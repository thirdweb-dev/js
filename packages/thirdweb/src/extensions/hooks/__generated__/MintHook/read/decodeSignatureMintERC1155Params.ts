import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "decodeSignatureMintERC1155Params" function.
 */
export type DecodeSignatureMintERC1155ParamsParams = {
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
};

const FN_SELECTOR = "0x2f9d8f67" as const;
const FN_INPUTS = [
  {
    name: "_data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "tuple",
    internalType: "struct MintHook.SignatureMintParamsERC1155",
    components: [
      {
        name: "request",
        type: "tuple",
        internalType: "struct MintHook.SignatureMintRequestERC1155",
        components: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "token",
            type: "address",
            internalType: "address",
          },
          {
            name: "startTimestamp",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "endTimestamp",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "quantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "currency",
            type: "address",
            internalType: "address",
          },
          {
            name: "pricePerUnit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "uid",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "signature",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "decodeSignatureMintERC1155Params" function.
 * @param options - The options for the decodeSignatureMintERC1155Params function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeDecodeSignatureMintERC1155ParamsParams } "thirdweb/extensions/hooks";
 * const result = encodeDecodeSignatureMintERC1155ParamsParams({
 *  data: ...,
 * });
 * ```
 */
export function encodeDecodeSignatureMintERC1155ParamsParams(
  options: DecodeSignatureMintERC1155ParamsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.data]);
}

/**
 * Decodes the result of the decodeSignatureMintERC1155Params function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeDecodeSignatureMintERC1155ParamsResult } from "thirdweb/extensions/hooks";
 * const result = decodeDecodeSignatureMintERC1155ParamsResult("...");
 * ```
 */
export function decodeDecodeSignatureMintERC1155ParamsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "decodeSignatureMintERC1155Params" function on the contract.
 * @param options - The options for the decodeSignatureMintERC1155Params function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeSignatureMintERC1155Params } from "thirdweb/extensions/hooks";
 *
 * const result = await decodeSignatureMintERC1155Params({
 *  data: ...,
 * });
 *
 * ```
 */
export async function decodeSignatureMintERC1155Params(
  options: BaseTransactionOptions<DecodeSignatureMintERC1155ParamsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.data],
  });
}
