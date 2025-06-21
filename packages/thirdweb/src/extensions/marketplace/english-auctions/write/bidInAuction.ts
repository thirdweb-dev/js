import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import * as IsNewWinningBid from "../../__generated__/IEnglishAuctions/read/isNewWinningBid.js";
import * as BidInAuction from "../../__generated__/IEnglishAuctions/write/bidInAuction.js";
import * as GetAuction from "../read/getAuction.js";
import * as GetWinningBid from "../read/getWinningBid.js";

/**
 * @extension MARKETPLACE
 */
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = bidInAuction({
 *  contract,
 *  auctionId: 0n,
 *  bidAmount: "100",
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function bidInAuction(
  options: BaseTransactionOptions<BidInAuctionParams>,
) {
  return BidInAuction.bidInAuction({
    asyncParams: async () => {
      const auction = await GetAuction.getAuction({
        auctionId: options.auctionId,
        contract: options.contract,
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
          client: options.contract.client,
          erc20Address: auction.currencyContractAddress,
        });
      })();

      if (resolvedBidAmountWei === 0n) {
        throw new Error("Bid amount is zero");
      }
      if (resolvedBidAmountWei > auction.buyoutCurrencyValue.value) {
        throw new Error("Bid amount is above the buyout amount");
      }
      const existingWinningBid = await GetWinningBid.getWinningBid({
        auctionId: options.auctionId,
        contract: options.contract,
      });
      if (existingWinningBid) {
        // check if the bid amount is sufficient to outbid the existing winning bid
        const isNewWinner = await IsNewWinningBid.isNewWinningBid({
          auctionId: options.auctionId,
          bidAmount: resolvedBidAmountWei,
          contract: options.contract,
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
          extraGas: 50_000n,
          value: isNativeTokenAddress(auction.currencyContractAddress)
            ? resolvedBidAmountWei
            : undefined, // add extra gas to account for router call
        },
      };
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `bidInAuction` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `bidInAuction` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isBidInAuctionSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isBidInAuctionSupported(["0x..."]);
 * ```
 */
export function isBidInAuctionSupported(availableSelectors: string[]) {
  return (
    BidInAuction.isBidInAuctionSupported(availableSelectors) &&
    GetWinningBid.isGetWinningBidSupported(availableSelectors) &&
    GetAuction.isGetAuctionSupported(availableSelectors) &&
    IsNewWinningBid.isIsNewWinningBidSupported(availableSelectors)
  );
}
