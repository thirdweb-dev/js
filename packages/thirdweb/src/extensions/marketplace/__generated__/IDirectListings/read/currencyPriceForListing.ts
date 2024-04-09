import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_currency",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "currencyPriceForListing" function.
 * @param options - The options for the currencyPriceForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCurrencyPriceForListingParams } "thirdweb/extensions/marketplace";
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
 * Decodes the result of the currencyPriceForListing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeCurrencyPriceForListingResult } from "thirdweb/extensions/marketplace";
 * const result = decodeCurrencyPriceForListingResult("...");
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
