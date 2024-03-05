import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createListing" function.
 */
export type CreateListingParams = {
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
 * Calls the "createListing" function on the contract.
 * @param options - The options for the "createListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { createListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createListing({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createListing(
  options: BaseTransactionOptions<CreateListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x746415b5",
      [
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
      [
        {
          internalType: "uint256",
          name: "listingId",
          type: "uint256",
        },
      ],
    ],
    params: [options.params],
  });
}
