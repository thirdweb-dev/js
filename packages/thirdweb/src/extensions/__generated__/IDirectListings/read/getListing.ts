import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getListing" function.
 */
export type GetListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
};

/**
 * Calls the getListing function on the contract.
 * @param options - The options for the getListing function.
 * @returns The parsed result of the function call.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { getListing } from "thirdweb/extensions/IDirectListings";
 *
 * const result = await getListing({
 *  listingId: ...,
 * });
 *
 * ```
 */
export async function getListing(
  options: BaseTransactionOptions<GetListingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x107a274a",
      [
        {
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
      ],
      [
        {
          components: [
            {
              internalType: "uint256",
              name: "listingId",
              type: "uint256",
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
              internalType: "address",
              name: "listingCreator",
              type: "address",
            },
            {
              internalType: "address",
              name: "assetContract",
              type: "address",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "enum IDirectListings.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "enum IDirectListings.Status",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "bool",
              name: "reserved",
              type: "bool",
            },
          ],
          internalType: "struct IDirectListings.Listing",
          name: "listing",
          type: "tuple",
        },
      ],
    ],
    params: [options.listingId],
  });
}
