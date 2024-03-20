import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAllAuctions" function.
 */
export type GetAllAuctionsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

const METHOD = [
  "0xc291537c",
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
] as const;

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
    method: METHOD,
    params: [options.startId, options.endId],
  });
}
