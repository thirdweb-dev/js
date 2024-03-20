import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getWinningBid" function.
 */
export type GetWinningBidParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

const METHOD = [
  "0x6891939d",
  [
    {
      type: "uint256",
      name: "_auctionId",
    },
  ],
  [
    {
      type: "address",
      name: "bidder",
    },
    {
      type: "address",
      name: "currency",
    },
    {
      type: "uint256",
      name: "bidAmount",
    },
  ],
] as const;

/**
 * Calls the "getWinningBid" function on the contract.
 * @param options - The options for the getWinningBid function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getWinningBid } from "thirdweb/extensions/marketplace";
 *
 * const result = await getWinningBid({
 *  auctionId: ...,
 * });
 *
 * ```
 */
export async function getWinningBid(
  options: BaseTransactionOptions<GetWinningBidParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.auctionId],
  });
}
