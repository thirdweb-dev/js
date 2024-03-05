import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "approveBuyerForListing" function.
 */
export type ApproveBuyerForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
  buyer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_buyer";
    type: "address";
  }>;
  toApprove: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "_toApprove";
    type: "bool";
  }>;
};

/**
 * Calls the approveBuyerForListing function on the contract.
 * @param options - The options for the approveBuyerForListing function.
 * @returns A prepared transaction object.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { approveBuyerForListing } from "thirdweb/extensions/IDirectListings";
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
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_buyer",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_toApprove",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.listingId, options.buyer, options.toApprove],
  });
}
