import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintERC1155" function.
 */
export type EncodeBytesBeforeMintERC1155Params = {
  params: AbiParameterToPrimitiveType<{
    name: "params";
    type: "tuple";
    internalType: "struct ClaimableERC1155.ClaimParamsERC1155";
    components: [
      {
        name: "request";
        type: "tuple";
        internalType: "struct ClaimableERC1155.ClaimRequestERC1155";
        components: [
          { name: "tokenId"; type: "uint256"; internalType: "uint256" },
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
      { name: "currency"; type: "address"; internalType: "address" },
      { name: "pricePerUnit"; type: "uint256"; internalType: "uint256" },
      {
        name: "recipientAllowlistProof";
        type: "bytes32[]";
        internalType: "bytes32[]";
      },
    ];
  }>;
};

export const FN_SELECTOR = "0x81be3fb8" as const;
const FN_INPUTS = [
  {
    name: "params",
    type: "tuple",
    internalType: "struct ClaimableERC1155.ClaimParamsERC1155",
    components: [
      {
        name: "request",
        type: "tuple",
        internalType: "struct ClaimableERC1155.ClaimRequestERC1155",
        components: [
          {
            name: "tokenId",
            type: "uint256",
            internalType: "uint256",
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
        name: "recipientAllowlistProof",
        type: "bytes32[]",
        internalType: "bytes32[]",
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
 * Checks if the `encodeBytesBeforeMintERC1155` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `encodeBytesBeforeMintERC1155` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEncodeBytesBeforeMintERC1155Supported } from "thirdweb/extensions/modular";
 *
 * const supported = await isEncodeBytesBeforeMintERC1155Supported(contract);
 * ```
 */
export async function isEncodeBytesBeforeMintERC1155Supported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "encodeBytesBeforeMintERC1155" function.
 * @param options - The options for the encodeBytesBeforeMintERC1155 function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC1155Params } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesBeforeMintERC1155Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeEncodeBytesBeforeMintERC1155Params(
  options: EncodeBytesBeforeMintERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "encodeBytesBeforeMintERC1155" function into a Hex string with its parameters.
 * @param options - The options for the encodeBytesBeforeMintERC1155 function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC1155 } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesBeforeMintERC1155({
 *  params: ...,
 * });
 * ```
 */
export function encodeEncodeBytesBeforeMintERC1155(
  options: EncodeBytesBeforeMintERC1155Params,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEncodeBytesBeforeMintERC1155Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the encodeBytesBeforeMintERC1155 function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEncodeBytesBeforeMintERC1155Result } from "thirdweb/extensions/modular";
 * const result = decodeEncodeBytesBeforeMintERC1155Result("...");
 * ```
 */
export function decodeEncodeBytesBeforeMintERC1155Result(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesBeforeMintERC1155" function on the contract.
 * @param options - The options for the encodeBytesBeforeMintERC1155 function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBytesBeforeMintERC1155 } from "thirdweb/extensions/modular";
 *
 * const result = await encodeBytesBeforeMintERC1155({
 *  contract,
 *  params: ...,
 * });
 *
 * ```
 */
export async function encodeBytesBeforeMintERC1155(
  options: BaseTransactionOptions<EncodeBytesBeforeMintERC1155Params>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.params],
  });
}
