import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "buyFromListing" function.
 */
export type BuyFromListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
  buyFor: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_buyFor";
    type: "address";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantity";
    type: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_currency";
    type: "address";
  }>;
  expectedTotalPrice: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_expectedTotalPrice";
    type: "uint256";
  }>;
};

/**
 * Calls the buyFromListing function on the contract.
 * @param options - The options for the buyFromListing function.
 * @returns A prepared transaction object.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { buyFromListing } from "thirdweb/extensions/IDirectListings";
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
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_buyFor",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_expectedTotalPrice",
          type: "uint256",
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
