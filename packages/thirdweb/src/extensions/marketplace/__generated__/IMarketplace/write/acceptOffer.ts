import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "acceptOffer" function.
 */
export type AcceptOfferParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
  offeror: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_offeror";
    type: "address";
  }>;
  currency: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_currency";
    type: "address";
  }>;
  totalPrice: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_totalPrice";
    type: "uint256";
  }>;
};

/**
 * Calls the "acceptOffer" function on the contract.
 * @param options - The options for the "acceptOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = acceptOffer({
 *  listingId: ...,
 *  offeror: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function acceptOffer(
  options: BaseTransactionOptions<AcceptOfferParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xb13c0e63",
      [
        {
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_offeror",
          type: "address",
        },
        {
          internalType: "address",
          name: "_currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_totalPrice",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [
      options.listingId,
      options.offeror,
      options.currency,
      options.totalPrice,
    ],
  });
}
