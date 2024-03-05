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
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "uint128"; name: "startTimestamp" },
      { type: "uint128"; name: "endTimestamp" },
      { type: "bool"; name: "reserved" },
    ];
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
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "tuple",
          name: "_params",
          components: [
            {
              type: "address",
              name: "assetContract",
            },
            {
              type: "uint256",
              name: "tokenId",
            },
            {
              type: "uint256",
              name: "quantity",
            },
            {
              type: "address",
              name: "currency",
            },
            {
              type: "uint256",
              name: "pricePerToken",
            },
            {
              type: "uint128",
              name: "startTimestamp",
            },
            {
              type: "uint128",
              name: "endTimestamp",
            },
            {
              type: "bool",
              name: "reserved",
            },
          ],
        },
      ],
      [],
    ],
    params: [options.listingId, options.params],
  });
}
