import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
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
  params: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "assetContract"; type: "address" },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "quantity"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
      { internalType: "uint256"; name: "pricePerToken"; type: "uint256" },
      { internalType: "uint128"; name: "startTimestamp"; type: "uint128" },
      { internalType: "uint128"; name: "endTimestamp"; type: "uint128" },
      { internalType: "bool"; name: "reserved"; type: "bool" },
    ];
    internalType: "struct IDirectListings.ListingParameters";
    name: "_params";
    type: "tuple";
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
 *  params: ...,
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
      "0x07b67758",
      [
        {
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "address",
              name: "assetContract",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "uint128",
              name: "startTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "endTimestamp",
              type: "uint128",
            },
            {
              internalType: "bool",
              name: "reserved",
              type: "bool",
            },
          ],
          internalType: "struct IDirectListings.ListingParameters",
          name: "_params",
          type: "tuple",
        },
      ],
      [],
    ],
    params: [options.listingId, options.params],
  });
}
