import { ADDRESS_ZERO } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { resolveCurrencyValue } from "../../../../utils/extensions/resolve-currency-value.js";
import {
  type GetWinningBidParams as GeneratedWinningBidParams,
  getWinningBid as getWinningBidGenerated,
} from "../../__generated__/IEnglishAuctions/read/getWinningBid.js";

export type GetWinningBidParams = GeneratedWinningBidParams;

/**
 * Retrieves the winning bid information for a given auction.
 *
 * @param options - The options for retrieving the winning bid.
 * @returns The winning bid information, or undefined if there is no winning bid.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getWinningBid } from "thirdweb/extensions/marketplace";
 *
 * const winningBid = await getWinningBid({
 *  contract,
 *  auctionId: 0n,
 * });
 * ```
 */
export async function getWinningBid(
  options: BaseTransactionOptions<GetWinningBidParams>,
) {
  const [bidderAddress, currencyAddress, bidAmountWei] =
    await getWinningBidGenerated(options);

  if (bidderAddress === ADDRESS_ZERO) {
    return undefined;
  }

  return {
    bidderAddress,
    currencyAddress,
    bidAmountWei,
    currencyValue: await resolveCurrencyValue({
      chain: options.contract.chain,
      client: options.contract.client,
      currencyAddress,
      wei: bidAmountWei,
    }),
  };
}
