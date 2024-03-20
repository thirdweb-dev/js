import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "bidInAuction" function.
 */

type BidInAuctionParamsInternal = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
};

export type BidInAuctionParams = Prettify<
  | BidInAuctionParamsInternal
  | {
      asyncParams: () => Promise<BidInAuctionParamsInternal>;
    }
>;
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
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.auctionId,
              resolvedParams.bidAmount,
            ] as const;
          }
        : [options.auctionId, options.bidAmount],
  });
}
