import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "computeProxyAddress" function.
 */
export type ComputeProxyAddressParams = {
  deployType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "deployType";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "salt" }>;
};

export const FN_SELECTOR = "0xbef11b31" as const;
const FN_INPUTS = [
  {
    type: "uint8",
    name: "deployType",
  },
  {
    type: "address",
    name: "implementation",
  },
  {
    type: "bytes",
    name: "data",
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
 * Checks if the `computeProxyAddress` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `computeProxyAddress` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isComputeProxyAddressSupported } from "thirdweb/extensions/tokens";
 * const supported = isComputeProxyAddressSupported(["0x..."]);
 * ```
 */
export function isComputeProxyAddressSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "computeProxyAddress" function.
 * @param options - The options for the computeProxyAddress function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeComputeProxyAddressParams } from "thirdweb/extensions/tokens";
 * const result = encodeComputeProxyAddressParams({
 *  deployType: ...,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeComputeProxyAddressParams(
  options: ComputeProxyAddressParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.deployType,
    options.implementation,
    options.data,
    options.salt,
  ]);
}

/**
 * Encodes the "computeProxyAddress" function into a Hex string with its parameters.
 * @param options - The options for the computeProxyAddress function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeComputeProxyAddress } from "thirdweb/extensions/tokens";
 * const result = encodeComputeProxyAddress({
 *  deployType: ...,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeComputeProxyAddress(options: ComputeProxyAddressParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeComputeProxyAddressParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the computeProxyAddress function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeComputeProxyAddressResult } from "thirdweb/extensions/tokens";
 * const result = decodeComputeProxyAddressResultResult("...");
 * ```
 */
export function decodeComputeProxyAddressResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "computeProxyAddress" function on the contract.
 * @param options - The options for the computeProxyAddress function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { computeProxyAddress } from "thirdweb/extensions/tokens";
 *
 * const result = await computeProxyAddress({
 *  contract,
 *  deployType: ...,
 *  implementation: ...,
 *  data: ...,
 *  salt: ...,
 * });
 *
 * ```
 */
export async function computeProxyAddress(
  options: BaseTransactionOptions<ComputeProxyAddressParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [
      options.deployType,
      options.implementation,
      options.data,
      options.salt,
    ],
  });
}
