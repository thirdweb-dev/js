import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "collectAuctionPayout" function.
 */

type CollectAuctionPayoutParamsInternal = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

export type CollectAuctionPayoutParams = Prettify<
  | CollectAuctionPayoutParamsInternal
  | {
      asyncParams: () => Promise<CollectAuctionPayoutParamsInternal>;
    }
>;
const FN_SELECTOR = "0xebf05a62" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "collectAuctionPayout" function.
 * @param options - The options for the collectAuctionPayout function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeCollectAuctionPayoutParams } "thirdweb/extensions/marketplace";
 * const result = encodeCollectAuctionPayoutParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCollectAuctionPayoutParams(
  options: CollectAuctionPayoutParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.auctionId] as const;
          }
        : [options.auctionId],
  });
}
