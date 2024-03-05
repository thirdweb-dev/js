import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAuction" function.
 */
export type GetAuctionParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

/**
 * Calls the "getAuction" function on the contract.
 * @param options - The options for the getAuction function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getAuction } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAuction({
 *  auctionId: ...,
 * });
 *
 * ```
 */
export async function getAuction(
  options: BaseTransactionOptions<GetAuctionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x78bd7935",
      [
        {
          type: "uint256",
          name: "_auctionId",
        },
      ],
      [
        {
          type: "tuple",
          name: "auction",
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
    params: [options.auctionId],
  });
}
