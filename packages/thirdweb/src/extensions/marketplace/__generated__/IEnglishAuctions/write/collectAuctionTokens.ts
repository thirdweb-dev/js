import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "collectAuctionTokens" function.
 */

type CollectAuctionTokensParamsInternal = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

export type CollectAuctionTokensParams = Prettify<
  | CollectAuctionTokensParamsInternal
  | {
      asyncParams: () => Promise<CollectAuctionTokensParamsInternal>;
    }
>;
const FN_SELECTOR = "0x03a54fe0" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "collectAuctionTokens" function.
 * @param options - The options for the collectAuctionTokens function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeCollectAuctionTokensParams } "thirdweb/extensions/marketplace";
 * const result = encodeCollectAuctionTokensParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCollectAuctionTokensParams(
  options: CollectAuctionTokensParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Calls the "collectAuctionTokens" function on the contract.
 * @param options - The options for the "collectAuctionTokens" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { collectAuctionTokens } from "thirdweb/extensions/marketplace";
 *
 * const transaction = collectAuctionTokens({
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function collectAuctionTokens(
  options: BaseTransactionOptions<CollectAuctionTokensParams>,
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
