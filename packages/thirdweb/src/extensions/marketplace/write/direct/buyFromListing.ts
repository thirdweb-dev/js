import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getListing } from "../../read/direct/getListing.js";
import type { DirectListing } from "../../types.js";
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
  // TODO: we need a better way to pass async value etc to prepareContractCall to avoid this!
  // trick to only resolve the listing once per transaction even though we access it multiple times
  let resolveListingPromise: Promise<DirectListing>;
  async function resolveListing() {
    if (!resolveListingPromise) {
      resolveListingPromise = (async () => {
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
        return listing;
      })();
    }
    return resolveListingPromise;
  }

  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x704232dc",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "address",
          name: "_buyFor",
        },
        {
          type: "uint256",
          name: "_quantity",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_expectedTotalPrice",
        },
      ] as const,
      [] as const,
    ] as const,
    value: async () => {
      const listing = await resolveListing();

      if (isNativeTokenAddress(listing.currencyContractAddress)) {
        return listing.pricePerToken * options.quantity;
      }
      return undefined;
    },
    params: async () => {
      const listing = await resolveListing();

      return [
        options.listingId,
        options.recipient,
        options.quantity,
        listing.currencyContractAddress,
        listing.pricePerToken * options.quantity,
      ] as const;
    },
  });
}
