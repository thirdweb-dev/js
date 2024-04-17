import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { cancelAuction as generatedCancelAuction } from "../../__generated__/IEnglishAuctions/write/cancelAuction.js";
import { getWinningBid } from "../../read/english-auction/getWinningBid.js";

export type CancelAuctionParams = {
  auctionId: bigint;
};

/**
 * Cancels an auction by providing the necessary options.
 *
 * @param options - The options for canceling the auction.
 * @returns A promise that resolves when the auction is canceled.
 * @throws An error if the auction has an existing bid and cannot be canceled.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { cancelAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelAuction({
 *  contract,
 *  auctionId: 0n,
 * });
 * ```
 */
export function cancelAuction(
  options: BaseTransactionOptions<CancelAuctionParams>,
) {
  return generatedCancelAuction({
    contract: options.contract,
    asyncParams: async () => {
      const winningBid = await getWinningBid({
        contract: options.contract,
        auctionId: options.auctionId,
      });
      if (winningBid) {
        throw new Error("Cannot cancel an auction with an existing bid");
      }
      return {
        auctionId: options.auctionId,
      };
    },
  });
}
