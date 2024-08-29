import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    name: "royaltyRecipient";
    type: "address";
    internalType: "address";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    name: "royaltyBps";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x9adb1e41" as const;
const FN_INPUTS = [
  {
    name: "royaltyRecipient",
    type: "address",
    internalType: "address",
  },
  {
    name: "royaltyBps",
    type: "uint256",
    internalType: "uint256",
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
 * Checks if the `encodeBytesOnInstall` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `encodeBytesOnInstall` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEncodeBytesOnInstallSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isEncodeBytesOnInstallSupported(["0x..."]);
 * ```
 */
export function isEncodeBytesOnInstallSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "encodeBytesOnInstall" function.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesOnInstallParams } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesOnInstallParams({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 * ```
 */
export function encodeEncodeBytesOnInstallParams(
  options: EncodeBytesOnInstallParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.royaltyRecipient,
    options.royaltyBps,
  ]);
}

/**
 * Encodes the "encodeBytesOnInstall" function into a Hex string with its parameters.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeEncodeBytesOnInstall } "thirdweb/extensions/modular";
 * const result = encodeEncodeBytesOnInstall({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 * ```
 */
export function encodeEncodeBytesOnInstall(
  options: EncodeBytesOnInstallParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeEncodeBytesOnInstallParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the encodeBytesOnInstall function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEncodeBytesOnInstallResult } from "thirdweb/extensions/modular";
 * const result = decodeEncodeBytesOnInstallResult("...");
 * ```
 */
export function decodeEncodeBytesOnInstallResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesOnInstall" function on the contract.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBytesOnInstall } from "thirdweb/extensions/modular";
 *
 * const result = await encodeBytesOnInstall({
 *  contract,
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * ```
 */
export async function encodeBytesOnInstall(
  options: BaseTransactionOptions<EncodeBytesOnInstallParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.royaltyRecipient, options.royaltyBps],
  });
}
