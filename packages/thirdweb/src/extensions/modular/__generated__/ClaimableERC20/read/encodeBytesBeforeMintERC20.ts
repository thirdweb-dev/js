import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "encodeBytesBeforeMintERC20" function.
 */
export type EncodeBytesBeforeMintERC20Params = {
  params: AbiParameterToPrimitiveType<{
    name: "params";
    type: "tuple";
    internalType: "struct ClaimableERC20.ClaimParamsERC20";
    components: [
      {
        name: "request";
        type: "tuple";
        internalType: "struct ClaimableERC20.ClaimRequestERC20";
        components: [
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

export const FN_SELECTOR = "0xe951ff30" as const;
const FN_INPUTS = [
  {
    name: "params",
    type: "tuple",
    internalType: "struct ClaimableERC20.ClaimParamsERC20",
    components: [
      {
        name: "request",
        type: "tuple",
        internalType: "struct ClaimableERC20.ClaimRequestERC20",
        components: [
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
 * Checks if the `encodeBytesBeforeMintERC20` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `encodeBytesBeforeMintERC20` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEncodeBytesBeforeMintERC20Supported } from "thirdweb/extensions/modular";
 *
 * const supported = isEncodeBytesBeforeMintERC20Supported(["0x..."]);
 * ```
 */
export function isEncodeBytesBeforeMintERC20Supported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "encodeBytesBeforeMintERC20" function.
 * @param options - The options for the encodeBytesBeforeMintERC20 function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC20Params } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesBeforeMintERC20Params({
 *  params: ...,
 * });
 * ```
 */
export function encodeEncodeBytesBeforeMintERC20Params(
  options: EncodeBytesBeforeMintERC20Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "encodeBytesBeforeMintERC20" function into a Hex string with its parameters.
 * @param options - The options for the encodeBytesBeforeMintERC20 function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesBeforeMintERC20 } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesBeforeMintERC20({
 *  params: ...,
 * });
 * ```
 */
export function encodeEncodeBytesBeforeMintERC20(
  options: EncodeBytesBeforeMintERC20Params,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEncodeBytesBeforeMintERC20Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the encodeBytesBeforeMintERC20 function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEncodeBytesBeforeMintERC20Result } from "thirdweb/extensions/modular";
 * const result = decodeEncodeBytesBeforeMintERC20Result("...");
 * ```
 */
export function decodeEncodeBytesBeforeMintERC20Result(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesBeforeMintERC20" function on the contract.
 * @param options - The options for the encodeBytesBeforeMintERC20 function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBytesBeforeMintERC20 } from "thirdweb/extensions/modular";
 *
 * const result = await encodeBytesBeforeMintERC20({
 *  contract,
 *  params: ...,
 * });
 *
 * ```
 */
export async function encodeBytesBeforeMintERC20(
  options: BaseTransactionOptions<EncodeBytesBeforeMintERC20Params>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.params],
  });
}
