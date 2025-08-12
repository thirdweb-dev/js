import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isErc20CurrencyRegistered" function.
 */
export type IsErc20CurrencyRegisteredParams = {
  currencyAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "currencyAddress";
  }>;
};

export const FN_SELECTOR = "0xf21b24d7" as const;
const FN_INPUTS = [
  {
    name: "currencyAddress",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isErc20CurrencyRegistered` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isErc20CurrencyRegistered` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isIsErc20CurrencyRegisteredSupported } from "thirdweb/extensions/lens";
 * const supported = isIsErc20CurrencyRegisteredSupported(["0x..."]);
 * ```
 */
export function isIsErc20CurrencyRegisteredSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isErc20CurrencyRegistered" function.
 * @param options - The options for the isErc20CurrencyRegistered function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsErc20CurrencyRegisteredParams } from "thirdweb/extensions/lens";
 * const result = encodeIsErc20CurrencyRegisteredParams({
 *  currencyAddress: ...,
 * });
 * ```
 */
export function encodeIsErc20CurrencyRegisteredParams(
  options: IsErc20CurrencyRegisteredParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.currencyAddress]);
}

/**
 * Encodes the "isErc20CurrencyRegistered" function into a Hex string with its parameters.
 * @param options - The options for the isErc20CurrencyRegistered function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeIsErc20CurrencyRegistered } from "thirdweb/extensions/lens";
 * const result = encodeIsErc20CurrencyRegistered({
 *  currencyAddress: ...,
 * });
 * ```
 */
export function encodeIsErc20CurrencyRegistered(
  options: IsErc20CurrencyRegisteredParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsErc20CurrencyRegisteredParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isErc20CurrencyRegistered function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeIsErc20CurrencyRegisteredResult } from "thirdweb/extensions/lens";
 * const result = decodeIsErc20CurrencyRegisteredResultResult("...");
 * ```
 */
export function decodeIsErc20CurrencyRegisteredResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isErc20CurrencyRegistered" function on the contract.
 * @param options - The options for the isErc20CurrencyRegistered function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { isErc20CurrencyRegistered } from "thirdweb/extensions/lens";
 *
 * const result = await isErc20CurrencyRegistered({
 *  contract,
 *  currencyAddress: ...,
 * });
 *
 * ```
 */
export async function isErc20CurrencyRegistered(
  options: BaseTransactionOptions<IsErc20CurrencyRegisteredParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.currencyAddress],
  });
}
