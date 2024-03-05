import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getAuction" function.
 */
export type GetAuctionParams = {
  auctionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_auctionId";
    type: "uint256";
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
          internalType: "uint256",
          name: "_auctionId",
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
          internalType: "struct IEnglishAuctions.Auction",
          name: "auction",
          type: "tuple",
        },
      ],
    ],
    params: [options.auctionId],
  });
}
