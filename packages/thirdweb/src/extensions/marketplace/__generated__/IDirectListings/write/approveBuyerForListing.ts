import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "approveBuyerForListing" function.
 */
export type ApproveBuyerForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyer: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyer" }>;
  toApprove: AbiParameterToPrimitiveType<{ type: "bool"; name: "_toApprove" }>;
};

/**
 * Calls the "approveBuyerForListing" function on the contract.
 * @param options - The options for the "approveBuyerForListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { approveBuyerForListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = approveBuyerForListing({
 *  listingId: ...,
 *  buyer: ...,
 *  toApprove: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approveBuyerForListing(
  options: BaseTransactionOptions<ApproveBuyerForListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x48dd77df",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "address",
          name: "_buyer",
        },
        {
          type: "bool",
          name: "_toApprove",
        },
      ],
      [],
    ],
    params: [options.listingId, options.buyer, options.toApprove],
  });
}
