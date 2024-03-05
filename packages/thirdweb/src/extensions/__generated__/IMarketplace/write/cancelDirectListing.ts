import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "cancelDirectListing" function.
 */
export type CancelDirectListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
};

/**
 * Calls the cancelDirectListing function on the contract.
 * @param options - The options for the cancelDirectListing function.
 * @returns A prepared transaction object.
 * @extension IMARKETPLACE
 * @example
 * ```
 * import { cancelDirectListing } from "thirdweb/extensions/IMarketplace";
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
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.listingId],
  });
}
