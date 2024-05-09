import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { multicall } from "../../../common/__generated__/IMulticall/write/multicall.js";
import { encodeCollectAuctionPayout } from "../../__generated__/IEnglishAuctions/write/collectAuctionPayout.js";
import { encodeCollectAuctionTokens } from "../../__generated__/IEnglishAuctions/write/collectAuctionTokens.js";
import { getWinningBid } from "../read/getWinningBid.js";

export type ExecuteSaleParams = {
  auctionId: bigint;
};

/**
 * Executes a sale for an English auction.
 *
 * @param options - The options for executing the sale.
 * @returns A transaction that can be sent to execute the sale.
 * @throws An error if the auction is still active and there is no winning bid.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { executeSale } from "thirdweb/extensions/marketplace";
 *
 * const transaction = executeSale({
 *  contract,
 *  auctionId: 0n,
 * });
 * ```
 */
export function executeSale(
  options: BaseTransactionOptions<ExecuteSaleParams>,
) {
  return multicall({
    contract: options.contract,
    asyncParams: async () => {
      const winningBid = await getWinningBid({
        contract: options.contract,
        auctionId: options.auctionId,
      });
      if (!winningBid) {
        throw new Error("Auction is still active");
      }

      return {
        data: [
          encodeCollectAuctionTokens({ auctionId: options.auctionId }),
          encodeCollectAuctionPayout({ auctionId: options.auctionId }),
        ],
        overrides: {
          extraGas: 50_000n, // add extra gas to account for router call
        },
      };
    },
  });
}
