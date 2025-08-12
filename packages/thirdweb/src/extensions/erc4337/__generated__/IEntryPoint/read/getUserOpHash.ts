import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getUserOpHash" function.
 */
export type GetUserOpHashParams = {
  userOp: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "userOp";
    components: [
      { type: "address"; name: "sender" },
      { type: "uint256"; name: "nonce" },
      { type: "bytes"; name: "initCode" },
      { type: "bytes"; name: "callData" },
      { type: "uint256"; name: "callGasLimit" },
      { type: "uint256"; name: "verificationGasLimit" },
      { type: "uint256"; name: "preVerificationGas" },
      { type: "uint256"; name: "maxFeePerGas" },
      { type: "uint256"; name: "maxPriorityFeePerGas" },
      { type: "bytes"; name: "paymasterAndData" },
      { type: "bytes"; name: "signature" },
    ];
  }>;
};

export const FN_SELECTOR = "0xa6193531" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "nonce",
        type: "uint256",
      },
      {
        name: "initCode",
        type: "bytes",
      },
      {
        name: "callData",
        type: "bytes",
      },
      {
        name: "callGasLimit",
        type: "uint256",
      },
      {
        name: "verificationGasLimit",
        type: "uint256",
      },
      {
        name: "preVerificationGas",
        type: "uint256",
      },
      {
        name: "maxFeePerGas",
        type: "uint256",
      },
      {
        name: "maxPriorityFeePerGas",
        type: "uint256",
      },
      {
        name: "paymasterAndData",
        type: "bytes",
      },
      {
        name: "signature",
        type: "bytes",
      },
    ],
    name: "userOp",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `getUserOpHash` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getUserOpHash` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetUserOpHashSupported } from "thirdweb/extensions/erc4337";
 * const supported = isGetUserOpHashSupported(["0x..."]);
 * ```
 */
export function isGetUserOpHashSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getUserOpHash" function.
 * @param options - The options for the getUserOpHash function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetUserOpHashParams } from "thirdweb/extensions/erc4337";
 * const result = encodeGetUserOpHashParams({
 *  userOp: ...,
 * });
 * ```
 */
export function encodeGetUserOpHashParams(options: GetUserOpHashParams) {
  return encodeAbiParameters(FN_INPUTS, [options.userOp]);
}

/**
 * Encodes the "getUserOpHash" function into a Hex string with its parameters.
 * @param options - The options for the getUserOpHash function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetUserOpHash } from "thirdweb/extensions/erc4337";
 * const result = encodeGetUserOpHash({
 *  userOp: ...,
 * });
 * ```
 */
export function encodeGetUserOpHash(options: GetUserOpHashParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetUserOpHashParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getUserOpHash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetUserOpHashResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetUserOpHashResultResult("...");
 * ```
 */
export function decodeGetUserOpHashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getUserOpHash" function on the contract.
 * @param options - The options for the getUserOpHash function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getUserOpHash } from "thirdweb/extensions/erc4337";
 *
 * const result = await getUserOpHash({
 *  contract,
 *  userOp: ...,
 * });
 *
 * ```
 */
export async function getUserOpHash(
  options: BaseTransactionOptions<GetUserOpHashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.userOp],
  });
}
