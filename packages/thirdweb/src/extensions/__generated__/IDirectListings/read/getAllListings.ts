import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllListings" function.
 */
export type GetAllListingsParams = {
  startId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_startId";
    type: "uint256";
  }>;
  endId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_endId";
    type: "uint256";
  }>;
};

/**
 * Calls the getAllListings function on the contract.
 * @param options - The options for the getAllListings function.
 * @returns The parsed result of the function call.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { getAllListings } from "thirdweb/extensions/IDirectListings";
 *
 * const result = await getAllListings({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllListings(
  options: BaseTransactionOptions<GetAllListingsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc5275fb0",
      [
        {
          internalType: "uint256",
          name: "_startId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_endId",
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
          internalType: "struct IDirectListings.Listing[]",
          name: "listings",
          type: "tuple[]",
        },
      ],
    ],
    params: [options.startId, options.endId],
  });
}
