import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "approveCurrencyForListing" function.
 */

export type ApproveCurrencyForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerTokenInCurrency: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerTokenInCurrency";
  }>;
};

export const FN_SELECTOR = "0xea8f9a3c" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_currency",
  },
  {
    type: "uint256",
    name: "_pricePerTokenInCurrency",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "approveCurrencyForListing" function.
 * @param options - The options for the approveCurrencyForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeApproveCurrencyForListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeApproveCurrencyForListingParams({
 *  listingId: ...,
 *  currency: ...,
 *  pricePerTokenInCurrency: ...,
 * });
 * ```
 */
export function encodeApproveCurrencyForListingParams(
  options: ApproveCurrencyForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.currency,
    options.pricePerTokenInCurrency,
  ]);
}

/**
 * Calls the "approveCurrencyForListing" function on the contract.
 * @param options - The options for the "approveCurrencyForListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { approveCurrencyForListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = approveCurrencyForListing({
 *  contract,
 *  listingId: ...,
 *  currency: ...,
 *  pricePerTokenInCurrency: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approveCurrencyForListing(
  options: BaseTransactionOptions<
    | ApproveCurrencyForListingParams
    | {
        asyncParams: () => Promise<ApproveCurrencyForListingParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.listingId,
              resolvedParams.currency,
              resolvedParams.pricePerTokenInCurrency,
            ] as const;
          }
        : [
            options.listingId,
            options.currency,
            options.pricePerTokenInCurrency,
          ],
  });
}
