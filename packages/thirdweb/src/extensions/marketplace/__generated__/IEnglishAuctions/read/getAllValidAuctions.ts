import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllValidAuctions" function.
 */
export type GetAllValidAuctionsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

/**
 * Calls the "getAllValidAuctions" function on the contract.
 * @param options - The options for the getAllValidAuctions function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getAllValidAuctions } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllValidAuctions({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllValidAuctions(
  options: BaseTransactionOptions<GetAllValidAuctionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x7b063801",
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
          name: "auctions",
          components: [
            {
              type: "uint256",
              name: "auctionId",
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
              name: "minimumBidAmount",
            },
            {
              type: "uint256",
              name: "buyoutBidAmount",
            },
            {
              type: "uint64",
              name: "timeBufferInSeconds",
            },
            {
              type: "uint64",
              name: "bidBufferBps",
            },
            {
              type: "uint64",
              name: "startTimestamp",
            },
            {
              type: "uint64",
              name: "endTimestamp",
            },
            {
              type: "address",
              name: "auctionCreator",
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
