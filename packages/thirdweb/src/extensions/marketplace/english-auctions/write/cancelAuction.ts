import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { cancelAuction as generatedCancelAuction } from "../../__generated__/IEnglishAuctions/write/cancelAuction.js";
import { getWinningBid } from "../read/getWinningBid.js";

export type CancelAuctionParams = {
  auctionId: bigint;
};

/**
 * Cancels an auction by providing the necessary options.
 *
 * @param options - The options for canceling the auction.
 * @returns A transaction that can be sent to cancel the auction.
 * @throws An error when sending the transaction if the auction has an existing bid and cannot be canceled.
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
        overrides: {
          extraGas: 50_000n, // add extra gas to account for router call
        },
      };
    },
  });
}
