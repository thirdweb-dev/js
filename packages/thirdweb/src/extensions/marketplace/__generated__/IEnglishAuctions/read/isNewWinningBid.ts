import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isNewWinningBid" function.
 */
export type IsNewWinningBidParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
};

const METHOD = [
  "0x2eb566bd",
  [
    {
      type: "uint256",
      name: "_auctionId",
    },
    {
      type: "uint256",
      name: "_bidAmount",
    },
  ],
  [
    {
      type: "bool",
    },
  ],
] as const;

/**
 * Calls the "isNewWinningBid" function on the contract.
 * @param options - The options for the isNewWinningBid function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { isNewWinningBid } from "thirdweb/extensions/marketplace";
 *
 * const result = await isNewWinningBid({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 *
 * ```
 */
export async function isNewWinningBid(
  options: BaseTransactionOptions<IsNewWinningBidParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.auctionId, options.bidAmount],
  });
}
