import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
    method: [
      "0x03a54fe0",
      [
        {
          type: "uint256",
          name: "_auctionId",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.auctionId] as const;
      }

      return [options.auctionId] as const;
    },
  });
}
