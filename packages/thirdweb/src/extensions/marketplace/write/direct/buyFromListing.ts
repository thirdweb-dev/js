import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { buyFromListing as buyFromListingGenerated } from "../../__generated__/IDirectListings/write/buyFromListing.js";
import { getListing } from "../../read/direct/getListing.js";
import { isListingValid } from "../../utils.js";

export type BuyFromListingParams = {
  listingId: bigint;
  quantity: bigint;
  recipient: Address;
};

/**
 * Buys a listing from the marketplace.
 *
 * @param options - The options for buying from a listing.
 * @returns A promise that resolves to the transaction result.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { buyFromListing } from "thirdweb/extensions/marketplace";
 *
 * const result = await buyFromListing({
 *  contract,
 *  listingId: 1n,
 *  quantity: 1n,
 *  recipient: "0x...",
 * });
 * ```
 */
export function buyFromListing(
  options: BaseTransactionOptions<BuyFromListingParams>,
) {
  return buyFromListingGenerated({
    contract: options.contract,
    asyncParams: async () => {
      const listing = await getListing({
        contract: options.contract,
        listingId: options.listingId,
      });
      const listingValidity = await isListingValid({
        contract: options.contract,
        listing: listing,
        quantity: options.quantity,
      });

      if (!listingValidity.valid) {
        throw new Error(listingValidity.reason);
      }

      return {
        listingId: options.listingId,
        buyFor: options.recipient,
        quantity: options.quantity,
        currency: listing.currencyContractAddress,
        expectedTotalPrice: listing.pricePerToken * options.quantity,
      };
    },
  });
}
