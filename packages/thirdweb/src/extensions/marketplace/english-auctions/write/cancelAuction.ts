import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import * as CancelAuction from "../../__generated__/IEnglishAuctions/write/cancelAuction.js";
import {
  getWinningBid,
  isGetWinningBidSupported,
} from "../read/getWinningBid.js";

/**
 * @extension MARKETPLACE
 */
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = cancelAuction({
 *  contract,
 *  auctionId: 0n,
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function cancelAuction(
  options: BaseTransactionOptions<CancelAuctionParams>,
) {
  return CancelAuction.cancelAuction({
    asyncParams: async () => {
      const winningBid = await getWinningBid({
        auctionId: options.auctionId,
        contract: options.contract,
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
    contract: options.contract,
  });
}

/**
 * Checks if the `cancelAuction` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `cancelAuction` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isCancelAuctionSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isCancelAuctionSupported(["0x..."]);
 * ```
 */
export function isCancelAuctionSupported(availableSelectors: string[]) {
  return (
    CancelAuction.isCancelAuctionSupported(availableSelectors) &&
    isGetWinningBidSupported(availableSelectors)
  );
}
