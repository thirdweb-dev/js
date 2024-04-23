import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { isCurrencyApprovedForListing } from "../../__generated__/IDirectListings/read/isCurrencyApprovedForListing.js";
import { getListing } from "./getListing.js";

export type CurrencyPriceForListingParams = {
  listingId: bigint;
  currency: Address;
};

/**
 * Retrieves the currency price for a listing.
 *
 * @param options - The options for retrieving the currency price.
 * @returns A promise that resolves to the currency price as a bigint.
 * @throws An error if the currency is not approved for the listing.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { currencyPriceForListing } from "thirdweb/extensions/marketplace";
 *
 * const price = await currencyPriceForListing({ contract, listingId: 1n, currency: "0x..." });
 * ```
 */
export async function currencyPriceForListing(
  options: BaseTransactionOptions<CurrencyPriceForListingParams>,
): Promise<bigint> {
  const [listing, isApprovedCurrency] = await Promise.all([
    getListing({
      contract: options.contract,
      listingId: options.listingId,
    }),
    isCurrencyApprovedForListing({
      contract: options.contract,
      currency: options.currency,
      listingId: options.listingId,
    }),
  ]);

  // if it's the same currency, return the price
  if (listing.currencyContractAddress === options.currency) {
    return listing.pricePerToken;
  }
  if (!isApprovedCurrency) {
    throw new Error(
      `Currency ${
        options.currency
      } is not approved for Listing ${options.listingId.toString()}.`,
    );
  }

  const { currencyPriceForListing: generatedCurrencyPriceForListing } =
    await import(
      "../../__generated__/IDirectListings/read/currencyPriceForListing.js"
    );

  return await generatedCurrencyPriceForListing({
    contract: options.contract,
    currency: options.currency,
    listingId: options.listingId,
  });
}
