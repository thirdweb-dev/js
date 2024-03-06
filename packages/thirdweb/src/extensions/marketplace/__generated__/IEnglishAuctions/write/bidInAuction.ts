import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "bidInAuction" function.
 */
export type BidInAuctionParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
};

/**
 * Calls the "bidInAuction" function on the contract.
 * @param options - The options for the "bidInAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { bidInAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = bidInAuction({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function bidInAuction(
  options: BaseTransactionOptions<BidInAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0858e5ad",
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
      [],
    ],
    params: [options.auctionId, options.bidAmount],
  });
}
