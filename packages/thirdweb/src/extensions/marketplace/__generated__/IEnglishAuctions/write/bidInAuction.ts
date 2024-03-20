import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
const FN_SELECTOR = "0x0858e5ad" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
  {
    type: "uint256",
    name: "_bidAmount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "bidInAuction" function.
 * @param options - The options for the bidInAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeBidInAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeBidInAuctionParams({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeBidInAuctionParams(options: BidInAuctionParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId, options.bidAmount]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
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
