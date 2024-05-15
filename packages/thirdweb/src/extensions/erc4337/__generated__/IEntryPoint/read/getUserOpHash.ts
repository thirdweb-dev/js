import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    type: "tuple",
    name: "userOp",
    components: [
      {
        type: "address",
        name: "sender",
      },
      {
        type: "uint256",
        name: "nonce",
      },
      {
        type: "bytes",
        name: "initCode",
      },
      {
        type: "bytes",
        name: "callData",
      },
      {
        type: "uint256",
        name: "callGasLimit",
      },
      {
        type: "uint256",
        name: "verificationGasLimit",
      },
      {
        type: "uint256",
        name: "preVerificationGas",
      },
      {
        type: "uint256",
        name: "maxFeePerGas",
      },
      {
        type: "uint256",
        name: "maxPriorityFeePerGas",
      },
      {
        type: "bytes",
        name: "paymasterAndData",
      },
      {
        type: "bytes",
        name: "signature",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `getUserOpHash` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getUserOpHash` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetUserOpHashSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetUserOpHashSupported(contract);
 * ```
 */
export async function isGetUserOpHashSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeGetUserOpHashParams } "thirdweb/extensions/erc4337";
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
 * import { encodeGetUserOpHash } "thirdweb/extensions/erc4337";
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
 * const result = decodeGetUserOpHashResult("...");
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
