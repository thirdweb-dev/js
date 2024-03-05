import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createListing" function.
 */
export type CreateListingParams = {
  params: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "assetContract"; type: "address" },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "startTime"; type: "uint256" },
      { internalType: "uint256"; name: "secondsUntilEndTime"; type: "uint256" },
      { internalType: "uint256"; name: "quantityToList"; type: "uint256" },
      { internalType: "address"; name: "currencyToAccept"; type: "address" },
      {
        internalType: "uint256";
        name: "reservePricePerToken";
        type: "uint256";
      },
      { internalType: "uint256"; name: "buyoutPricePerToken"; type: "uint256" },
      {
        internalType: "enum IMarketplace.ListingType";
        name: "listingType";
        type: "uint8";
      },
    ];
    internalType: "struct IMarketplace.ListingParameters";
    name: "_params";
    type: "tuple";
  }>;
};

/**
 * Calls the createListing function on the contract.
 * @param options - The options for the createListing function.
 * @returns A prepared transaction object.
 * @extension IMARKETPLACE
 * @example
 * ```
 * import { createListing } from "thirdweb/extensions/IMarketplace";
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
      "0x296f4e16",
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
              name: "startTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "secondsUntilEndTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantityToList",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currencyToAccept",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "reservePricePerToken",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "buyoutPricePerToken",
              type: "uint256",
            },
            {
              internalType: "enum IMarketplace.ListingType",
              name: "listingType",
              type: "uint8",
            },
          ],
          internalType: "struct IMarketplace.ListingParameters",
          name: "_params",
          type: "tuple",
        },
      ],
      [],
    ],
    params: [options.params],
  });
}
