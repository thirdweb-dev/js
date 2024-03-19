import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "cancelDirectListing" function.
 */

type CancelDirectListingParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

export type CancelDirectListingParams = Prettify<
  | CancelDirectListingParamsInternal
  | {
      asyncParams: () => Promise<CancelDirectListingParamsInternal>;
    }
>;
/**
 * Calls the "cancelDirectListing" function on the contract.
 * @param options - The options for the "cancelDirectListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { cancelDirectListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelDirectListing({
 *  listingId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelDirectListing(
  options: BaseTransactionOptions<CancelDirectListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x7506c84a",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.listingId] as const;
      }

      return [options.listingId] as const;
    },
  });
}
