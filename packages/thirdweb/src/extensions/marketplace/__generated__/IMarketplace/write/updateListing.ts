import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "updateListing" function.
 */
export type UpdateListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  quantityToList: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_quantityToList";
  }>;
  reservePricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_reservePricePerToken";
  }>;
  buyoutPricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_buyoutPricePerToken";
  }>;
  currencyToAccept: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_currencyToAccept";
  }>;
  startTime: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_startTime";
  }>;
  secondsUntilEndTime: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_secondsUntilEndTime";
  }>;
};

/**
 * Calls the "updateListing" function on the contract.
 * @param options - The options for the "updateListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { updateListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = updateListing({
 *  listingId: ...,
 *  quantityToList: ...,
 *  reservePricePerToken: ...,
 *  buyoutPricePerToken: ...,
 *  currencyToAccept: ...,
 *  startTime: ...,
 *  secondsUntilEndTime: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateListing(
  options: BaseTransactionOptions<UpdateListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc4b5b15f",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "uint256",
          name: "_quantityToList",
        },
        {
          type: "uint256",
          name: "_reservePricePerToken",
        },
        {
          type: "uint256",
          name: "_buyoutPricePerToken",
        },
        {
          type: "address",
          name: "_currencyToAccept",
        },
        {
          type: "uint256",
          name: "_startTime",
        },
        {
          type: "uint256",
          name: "_secondsUntilEndTime",
        },
      ],
      [],
    ],
    params: [
      options.listingId,
      options.quantityToList,
      options.reservePricePerToken,
      options.buyoutPricePerToken,
      options.currencyToAccept,
      options.startTime,
      options.secondsUntilEndTime,
    ],
  });
}
