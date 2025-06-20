import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import * as BuyFromListing from "../../__generated__/IDirectListings/write/buyFromListing.js";
import * as GetListing from "../read/getListing.js";
import { isListingValid } from "../utils.js";

/**
 * @extension MARKETPLACE
 */
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = buyFromListing({
 *  contract,
 *  listingId: 1n,
 *  quantity: 1n,
 *  recipient: "0x...",
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 *
 * When using `buyFromListing` with Pay, the `erc20Value` will be automatically set to the listing currency.
 */
export function buyFromListing(
  options: BaseTransactionOptions<BuyFromListingParams>,
) {
  return BuyFromListing.buyFromListing({
    asyncParams: async () => {
      const listing = await GetListing.getListing({
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
        buyFor: options.recipient,
        currency: listing.currencyContractAddress,
        expectedTotalPrice: listing.pricePerToken * options.quantity,
        listingId: options.listingId,
        overrides: {
          erc20Value: isNativeTokenAddress(listing.currencyContractAddress)
            ? undefined
            : {
                amountWei: listing.pricePerToken * options.quantity,
                tokenAddress: listing.currencyContractAddress,
              },
          extraGas: 50_000n, // add extra gas to account for router call
          value: isNativeTokenAddress(listing.currencyContractAddress)
            ? listing.pricePerToken * options.quantity
            : 0n,
        },
        quantity: options.quantity,
      };
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `buyFromListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `buyFromListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isBuyFromListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isBuyFromListingSupported(["0x..."]);
 * ```
 */
export function isBuyFromListingSupported(availableSelectors: string[]) {
  return (
    BuyFromListing.isBuyFromListingSupported(availableSelectors) &&
    GetListing.isGetListingSupported(availableSelectors)
  );
}
