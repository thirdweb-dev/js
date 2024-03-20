import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllListings" function.
 */
export type GetAllListingsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

const METHOD = [
  "0xc5275fb0",
  [
    {
      type: "uint256",
      name: "_startId",
    },
    {
      type: "uint256",
      name: "_endId",
    },
  ],
  [
    {
      type: "tuple[]",
      name: "listings",
      components: [
        {
          type: "uint256",
          name: "listingId",
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
          type: "address",
          name: "listingCreator",
        },
        {
          type: "address",
          name: "assetContract",
        },
        {
          type: "address",
          name: "currency",
        },
        {
          type: "uint8",
          name: "tokenType",
        },
        {
          type: "uint8",
          name: "status",
        },
        {
          type: "bool",
          name: "reserved",
        },
      ],
    },
  ],
] as const;

/**
 * Calls the "getAllListings" function on the contract.
 * @param options - The options for the getAllListings function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getAllListings } from "thirdweb/extensions/marketplace";
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
    method: METHOD,
    params: [options.startId, options.endId],
  });
}
