import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { isNewWinningBid } from "../../__generated__/IEnglishAuctions/read/isNewWinningBid.js";
import { bidInAuction as generatedBidInAuction } from "../../__generated__/IEnglishAuctions/write/bidInAuction.js";
import { getAuction } from "../read/getAuction.js";
import { getWinningBid } from "../read/getWinningBid.js";

export type BidInAuctionParams = {
  auctionId: bigint;
} & (
  | {
      bidAmountWei: bigint;
    }
  | { bidAmount: string }
);

/**
 * Places a bid in an English auction.
 * @param options - The options for placing the bid.
 * @returns A transaction that can be sent to place the bid.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { bidInAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = bidInAuction({
 *  contract,
 *  auctionId: 0n,
 *  bidAmount: "100",
 * });
 * ```
 */
export function bidInAuction(
  options: BaseTransactionOptions<BidInAuctionParams>,
) {
  return generatedBidInAuction({
    contract: options.contract,
    asyncParams: async () => {
      const auction = await getAuction({
        contract: options.contract,
        auctionId: options.auctionId,
      });

      const resolvedBidAmountWei = await (async () => {
        // if we already have the bid amount in wei, use that
        if ("bidAmountWei" in options) {
          return options.bidAmountWei;
        }
        // otherwise load the utility function and convert the amount
        const { convertErc20Amount } = await import(
          "../../../../utils/extensions/convert-erc20-amount.js"
        );
        return await convertErc20Amount({
          amount: options.bidAmount,
          chain: options.contract.chain,
          erc20Address: auction.currencyContractAddress,
          client: options.contract.client,
        });
      })();

      if (resolvedBidAmountWei === 0n) {
        throw new Error("Bid amount is zero");
      }
      if (resolvedBidAmountWei > auction.buyoutCurrencyValue.value) {
        throw new Error("Bid amount is above the buyout amount");
      }
      const existingWinningBid = await getWinningBid({
        auctionId: options.auctionId,
        contract: options.contract,
      });
      if (existingWinningBid) {
        // check if the bid amount is sufficient to outbid the existing winning bid
        const isNewWinner = await isNewWinningBid({
          contract: options.contract,
          auctionId: options.auctionId,
          bidAmount: resolvedBidAmountWei,
        });
        if (!isNewWinner) {
          throw new Error(
            "Bid amount is too low to outbid the existing winning bid",
          );
        }
      } else {
        // no existing winning bid, check if the bid amount is sufficient to outbid the minimum bid
        if (resolvedBidAmountWei < auction.minimumBidCurrencyValue.value) {
          throw new Error("Bid amount is below the minimum bid amount");
        }
      }

      return {
        auctionId: options.auctionId,
        bidAmount: resolvedBidAmountWei,
        overrides: {
          value: isNativeTokenAddress(auction.currencyContractAddress)
            ? resolvedBidAmountWei
            : undefined,
          extraGas: 50_000n, // add extra gas to account for router call
        },
      };
    },
  });
}
