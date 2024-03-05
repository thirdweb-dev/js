import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "updateListing" function.
 */
export type UpdateListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
  quantityToList: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantityToList";
    type: "uint256";
  }>;
  reservePricePerToken: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_reservePricePerToken";
    type: "uint256";
  }>;
  buyoutPricePerToken: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_buyoutPricePerToken";
    type: "uint256";
  }>;
  currencyToAccept: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_currencyToAccept";
    type: "address";
  }>;
  startTime: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_startTime";
    type: "uint256";
  }>;
  secondsUntilEndTime: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_secondsUntilEndTime";
    type: "uint256";
  }>;
};

/**
 * Calls the updateListing function on the contract.
 * @param options - The options for the updateListing function.
 * @returns A prepared transaction object.
 * @extension IMARKETPLACE
 * @example
 * ```
 * import { updateListing } from "thirdweb/extensions/IMarketplace";
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
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_quantityToList",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_reservePricePerToken",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_buyoutPricePerToken",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_currencyToAccept",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_secondsUntilEndTime",
          type: "uint256",
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
