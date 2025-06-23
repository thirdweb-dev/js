import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "currencyPriceForListing" function.
 */
export type CurrencyPriceForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
};

export const FN_SELECTOR = "0xfb14079d" as const;
const FN_INPUTS = [
  {
    name: "_listingId",
    type: "uint256",
  },
  {
    name: "_currency",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `currencyPriceForListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `currencyPriceForListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isCurrencyPriceForListingSupported } from "thirdweb/extensions/marketplace";
 * const supported = isCurrencyPriceForListingSupported(["0x..."]);
 * ```
 */
export function isCurrencyPriceForListingSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "currencyPriceForListing" function.
 * @param options - The options for the currencyPriceForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCurrencyPriceForListingParams } from "thirdweb/extensions/marketplace";
 * const result = encodeCurrencyPriceForListingParams({
 *  listingId: ...,
 *  currency: ...,
 * });
 * ```
 */
export function encodeCurrencyPriceForListingParams(
  options: CurrencyPriceForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId, options.currency]);
}

/**
 * Encodes the "currencyPriceForListing" function into a Hex string with its parameters.
 * @param options - The options for the currencyPriceForListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCurrencyPriceForListing } from "thirdweb/extensions/marketplace";
 * const result = encodeCurrencyPriceForListing({
 *  listingId: ...,
 *  currency: ...,
 * });
 * ```
 */
export function encodeCurrencyPriceForListing(
  options: CurrencyPriceForListingParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCurrencyPriceForListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the currencyPriceForListing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeCurrencyPriceForListingResult } from "thirdweb/extensions/marketplace";
 * const result = decodeCurrencyPriceForListingResultResult("...");
 * ```
 */
export function decodeCurrencyPriceForListingResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "currencyPriceForListing" function on the contract.
 * @param options - The options for the currencyPriceForListing function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { currencyPriceForListing } from "thirdweb/extensions/marketplace";
 *
 * const result = await currencyPriceForListing({
 *  contract,
 *  listingId: ...,
 *  currency: ...,
 * });
 *
 * ```
 */
export async function currencyPriceForListing(
  options: BaseTransactionOptions<CurrencyPriceForListingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.listingId, options.currency],
  });
}
