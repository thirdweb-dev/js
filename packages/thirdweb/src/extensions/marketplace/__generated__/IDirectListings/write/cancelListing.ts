import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "cancelListing" function.
 */

type CancelListingParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

export type CancelListingParams = Prettify<
  | CancelListingParamsInternal
  | {
      asyncParams: () => Promise<CancelListingParamsInternal>;
    }
>;
const METHOD = [
  "0x305a67a8",
  [
    {
      type: "uint256",
      name: "_listingId",
    },
  ],
  [],
] as const;

/**
 * Calls the "cancelListing" function on the contract.
 * @param options - The options for the "cancelListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { cancelListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelListing({
 *  listingId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelListing(
  options: BaseTransactionOptions<CancelListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.listingId] as const;
          }
        : [options.listingId],
  });
}
