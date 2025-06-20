import { ZERO_ADDRESS } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { resolveCurrencyValue } from "../../../../utils/extensions/resolve-currency-value.js";
import * as GetWinningBid from "../../__generated__/IEnglishAuctions/read/getWinningBid.js";

/**
 * @extension MARKETPLACE
 */
export type GetWinningBidParams = GetWinningBid.GetWinningBidParams;

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
    await GetWinningBid.getWinningBid(options);

  if (bidderAddress === ZERO_ADDRESS) {
    return undefined;
  }

  return {
    bidAmountWei,
    bidderAddress,
    currencyAddress,
    currencyValue: await resolveCurrencyValue({
      chain: options.contract.chain,
      client: options.contract.client,
      currencyAddress,
      wei: bidAmountWei,
    }),
  };
}

/**
 * Checks if the `getWinningBid` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getWinningBid` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetWinningBidSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isGetWinningBidSupported(["0x..."]);
 * ```
 */
export function isGetWinningBidSupported(availableSelectors: string[]) {
  return GetWinningBid.isGetWinningBidSupported(availableSelectors);
}
