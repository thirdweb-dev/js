import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "approveCurrencyForListing" function.
 */

type ApproveCurrencyForListingParamsInternal = {
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

export type ApproveCurrencyForListingParams = Prettify<
  | ApproveCurrencyForListingParamsInternal
  | {
      asyncParams: () => Promise<ApproveCurrencyForListingParamsInternal>;
    }
>;
/**
 * Calls the "approveCurrencyForListing" function on the contract.
 * @param options - The options for the "approveCurrencyForListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { approveCurrencyForListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = approveCurrencyForListing({
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
  options: BaseTransactionOptions<ApproveCurrencyForListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xea8f9a3c",
      [
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
      ],
      [],
    ],
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
