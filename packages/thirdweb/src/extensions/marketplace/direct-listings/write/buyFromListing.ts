import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { buyFromListing as generatedBuyFromListing } from "../../__generated__/IDirectListings/write/buyFromListing.js";
import { getListing } from "../read/getListing.js";
import { isListingValid } from "../utils.js";

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
  return generatedBuyFromListing({
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
        quantity: options.quantity,
        buyFor: options.recipient,
        currency: listing.currencyContractAddress,
        expectedTotalPrice: listing.pricePerToken * options.quantity,
        overrides: {
          value: isNativeTokenAddress(listing.currencyContractAddress)
            ? listing.pricePerToken * options.quantity
            : 0n,
          extraGas: 50_000n, // add extra gas to account for router call
        },
      };
    },
  });
}
