import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "collectAuctionTokens" function.
 */
export type CollectAuctionTokensParams = {
  auctionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_auctionId";
    type: "uint256";
  }>;
};

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
          internalType: "uint256",
          name: "_auctionId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.auctionId],
  });
}
