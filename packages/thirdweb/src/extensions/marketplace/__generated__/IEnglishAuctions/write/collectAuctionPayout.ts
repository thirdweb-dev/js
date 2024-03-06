import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "collectAuctionPayout" function.
 */
export type CollectAuctionPayoutParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

/**
 * Calls the "collectAuctionPayout" function on the contract.
 * @param options - The options for the "collectAuctionPayout" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { collectAuctionPayout } from "thirdweb/extensions/marketplace";
 *
 * const transaction = collectAuctionPayout({
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function collectAuctionPayout(
  options: BaseTransactionOptions<CollectAuctionPayoutParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xebf05a62",
      [
        {
          type: "uint256",
          name: "_auctionId",
        },
      ],
      [],
    ],
    params: [options.auctionId],
  });
}
