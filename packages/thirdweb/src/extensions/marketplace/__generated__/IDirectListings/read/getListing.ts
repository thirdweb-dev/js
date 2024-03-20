import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getListing" function.
 */
export type GetListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

/**
 * Calls the "getListing" function on the contract.
 * @param options - The options for the getListing function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getListing } from "thirdweb/extensions/marketplace";
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
          type: "uint256",
          name: "_listingId",
        },
      ],
      [
        {
          type: "tuple",
          name: "listing",
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
    ],
    params: [options.listingId],
  });
}
