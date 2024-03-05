import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "buyFromListing" function.
 */
export type BuyFromListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyFor: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyFor" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  expectedTotalPrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_expectedTotalPrice";
  }>;
};

/**
 * Calls the "buyFromListing" function on the contract.
 * @param options - The options for the "buyFromListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { buyFromListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = buyFromListing({
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  expectedTotalPrice: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function buyFromListing(
  options: BaseTransactionOptions<BuyFromListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x704232dc",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "address",
          name: "_buyFor",
        },
        {
          type: "uint256",
          name: "_quantity",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_expectedTotalPrice",
        },
      ],
      [],
    ],
    params: [
      options.listingId,
      options.buyFor,
      options.quantity,
      options.currency,
      options.expectedTotalPrice,
    ],
  });
}
