import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllValidOffers" function.
 */
export type GetAllValidOffersParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

/**
 * Calls the "getAllValidOffers" function on the contract.
 * @param options - The options for the getAllValidOffers function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getAllValidOffers } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllValidOffers({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllValidOffers(
  options: BaseTransactionOptions<GetAllValidOffersParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x91940b3e",
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
          name: "offers",
          components: [
            {
              type: "uint256",
              name: "offerId",
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
              name: "totalPrice",
            },
            {
              type: "uint256",
              name: "expirationTimestamp",
            },
            {
              type: "address",
              name: "offeror",
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
          ],
        },
      ],
    ],
    params: [options.startId, options.endId],
  });
}
