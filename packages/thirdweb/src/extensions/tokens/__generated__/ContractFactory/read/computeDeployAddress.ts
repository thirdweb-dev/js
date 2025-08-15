import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "computeDeployAddress" function.
 */
export type ComputeDeployAddressParams = {
  deployType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "deployType";
  }>;
  bytecode: AbiParameterToPrimitiveType<{ type: "bytes"; name: "bytecode" }>;
  constructorArgs: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "constructorArgs";
  }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
};

export const FN_SELECTOR = "0xd5ec7faa" as const;
const FN_INPUTS = [
  {
    type: "uint8",
    name: "deployType",
  },
  {
    type: "bytes",
    name: "bytecode",
  },
  {
    type: "bytes",
    name: "constructorArgs",
  },
  {
    type: "bytes32",
    name: "salt",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `computeDeployAddress` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `computeDeployAddress` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isComputeDeployAddressSupported } from "thirdweb/extensions/tokens";
 * const supported = isComputeDeployAddressSupported(["0x..."]);
 * ```
 */
export function isComputeDeployAddressSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "computeDeployAddress" function.
 * @param options - The options for the computeDeployAddress function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeComputeDeployAddressParams } from "thirdweb/extensions/tokens";
 * const result = encodeComputeDeployAddressParams({
 *  deployType: ...,
 *  bytecode: ...,
 *  constructorArgs: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeComputeDeployAddressParams(
  options: ComputeDeployAddressParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.deployType,
    options.bytecode,
    options.constructorArgs,
    options.salt,
  ]);
}

/**
 * Encodes the "computeDeployAddress" function into a Hex string with its parameters.
 * @param options - The options for the computeDeployAddress function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeComputeDeployAddress } from "thirdweb/extensions/tokens";
 * const result = encodeComputeDeployAddress({
 *  deployType: ...,
 *  bytecode: ...,
 *  constructorArgs: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeComputeDeployAddress(
  options: ComputeDeployAddressParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeComputeDeployAddressParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the computeDeployAddress function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeComputeDeployAddressResult } from "thirdweb/extensions/tokens";
 * const result = decodeComputeDeployAddressResultResult("...");
 * ```
 */
export function decodeComputeDeployAddressResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "computeDeployAddress" function on the contract.
 * @param options - The options for the computeDeployAddress function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { computeDeployAddress } from "thirdweb/extensions/tokens";
 *
 * const result = await computeDeployAddress({
 *  contract,
 *  deployType: ...,
 *  bytecode: ...,
 *  constructorArgs: ...,
 *  salt: ...,
 * });
 *
 * ```
 */
export async function computeDeployAddress(
  options: BaseTransactionOptions<ComputeDeployAddressParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [
      options.deployType,
      options.bytecode,
      options.constructorArgs,
      options.salt,
    ],
  });
}
