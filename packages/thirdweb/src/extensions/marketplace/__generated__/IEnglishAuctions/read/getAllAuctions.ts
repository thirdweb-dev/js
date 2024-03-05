import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllAuctions" function.
 */
export type GetAllAuctionsParams = {
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
 * Calls the "getAllAuctions" function on the contract.
 * @param options - The options for the getAllAuctions function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getAllAuctions } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllAuctions({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllAuctions(
  options: BaseTransactionOptions<GetAllAuctionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc291537c",
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
              name: "auctionId",
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
              name: "minimumBidAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "buyoutBidAmount",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "timeBufferInSeconds",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "bidBufferBps",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "startTimestamp",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "endTimestamp",
              type: "uint64",
            },
            {
              internalType: "address",
              name: "auctionCreator",
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
              internalType: "enum IEnglishAuctions.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "enum IEnglishAuctions.Status",
              name: "status",
              type: "uint8",
            },
          ],
          internalType: "struct IEnglishAuctions.Auction[]",
          name: "auctions",
          type: "tuple[]",
        },
      ],
    ],
    params: [options.startId, options.endId],
  });
}
