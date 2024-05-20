import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "signatureMintERC1155" function.
 */
export type SignatureMintERC1155Params = {
  params: AbiParameterToPrimitiveType<{
    name: "_params";
    type: "tuple";
    internalType: "struct MintHook.SignatureMintParamsERC1155";
    components: [
      {
        name: "request";
        type: "tuple";
        internalType: "struct MintHook.SignatureMintRequestERC1155";
        components: [
          { name: "tokenId"; type: "uint256"; internalType: "uint256" },
          { name: "token"; type: "address"; internalType: "address" },
          { name: "startTimestamp"; type: "uint48"; internalType: "uint48" },
          { name: "endTimestamp"; type: "uint48"; internalType: "uint48" },
          { name: "recipient"; type: "address"; internalType: "address" },
          { name: "quantity"; type: "uint256"; internalType: "uint256" },
          { name: "currency"; type: "address"; internalType: "address" },
          { name: "pricePerUnit"; type: "uint256"; internalType: "uint256" },
          { name: "uid"; type: "bytes32"; internalType: "bytes32" },
        ];
      },
      { name: "signature"; type: "bytes"; internalType: "bytes" },
    ];
  }>;
};

const FN_SELECTOR = "0xf0434a1e" as const;
const FN_INPUTS = [
  {
    name: "_params",
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
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes",
    internalType: "bytes",
  },
] as const;

/**
 * Encodes the parameters for the "signatureMintERC1155" function.
 * @param options - The options for the signatureMintERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeSignatureMintERC1155Params } "thirdweb/extensions/hooks";
 * const result = encodeSignatureMintERC1155Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeSignatureMintERC1155Params(
  options: SignatureMintERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Decodes the result of the signatureMintERC1155 function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeSignatureMintERC1155Result } from "thirdweb/extensions/hooks";
 * const result = decodeSignatureMintERC1155Result("...");
 * ```
 */
export function decodeSignatureMintERC1155Result(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "signatureMintERC1155" function on the contract.
 * @param options - The options for the signatureMintERC1155 function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { signatureMintERC1155 } from "thirdweb/extensions/hooks";
 *
 * const result = await signatureMintERC1155({
 *  params: ...,
 * });
 *
 * ```
 */
export async function signatureMintERC1155(
  options: BaseTransactionOptions<SignatureMintERC1155Params>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.params],
  });
}
