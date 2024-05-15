import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "price" function.
 */
export type PriceParams = {
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
};

export const FN_SELECTOR = "0x26a49e37" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "extraStorage",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `price` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `price` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isPriceSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isPriceSupported(contract);
 * ```
 */
export async function isPriceSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "price" function.
 * @param options - The options for the price function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodePriceParams } "thirdweb/extensions/farcaster";
 * const result = encodePriceParams({
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodePriceParams(options: PriceParams) {
  return encodeAbiParameters(FN_INPUTS, [options.extraStorage]);
}

/**
 * Encodes the "price" function into a Hex string with its parameters.
 * @param options - The options for the price function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodePrice } "thirdweb/extensions/farcaster";
 * const result = encodePrice({
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodePrice(options: PriceParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePriceParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the price function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodePriceResult } from "thirdweb/extensions/farcaster";
 * const result = decodePriceResult("...");
 * ```
 */
export function decodePriceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "price" function on the contract.
 * @param options - The options for the price function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { price } from "thirdweb/extensions/farcaster";
 *
 * const result = await price({
 *  contract,
 *  extraStorage: ...,
 * });
 *
 * ```
 */
export async function price(options: BaseTransactionOptions<PriceParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.extraStorage],
  });
}
