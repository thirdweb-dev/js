import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllOffers" function.
 */
export type GetAllOffersParams = {
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
 * Calls the "getAllOffers" function on the contract.
 * @param options - The options for the getAllOffers function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getAllOffers } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllOffers({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllOffers(
  options: BaseTransactionOptions<GetAllOffersParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc1edcfbe",
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
              name: "offerId",
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
              name: "totalPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expirationTimestamp",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "offeror",
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
              internalType: "enum IOffers.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "enum IOffers.Status",
              name: "status",
              type: "uint8",
            },
          ],
          internalType: "struct IOffers.Offer[]",
          name: "offers",
          type: "tuple[]",
        },
      ],
    ],
    params: [options.startId, options.endId],
  });
}
