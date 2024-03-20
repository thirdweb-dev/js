import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isAuctionExpired" function.
 */
export type IsAuctionExpiredParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

const METHOD = [
  "0x1389b117",
  [
    {
      type: "uint256",
      name: "_auctionId",
    },
  ],
  [
    {
      type: "bool",
    },
  ],
] as const;

/**
 * Calls the "isAuctionExpired" function on the contract.
 * @param options - The options for the isAuctionExpired function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { isAuctionExpired } from "thirdweb/extensions/marketplace";
 *
 * const result = await isAuctionExpired({
 *  auctionId: ...,
 * });
 *
 * ```
 */
export async function isAuctionExpired(
  options: BaseTransactionOptions<IsAuctionExpiredParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.auctionId],
  });
}
