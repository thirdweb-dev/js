import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getListing } from "./getListing.js";

export type IsBuyerApprovedForListingParams = {
  listingId: bigint;
  buyer: Address;
};

/**
 * Checks if the buyer is approved for a listing.
 *
 * @param options - The options for checking buyer approval.
 * @returns A promise that resolves to a boolean indicating whether the buyer is approved for the listing.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isBuyerApprovedForListing } from "thirdweb/extensions/marketplace";
 *
 * const isApproved = await isBuyerApprovedForListing({ contract, listingId: 1n, buyer: "0x..." });
 * ```
 */
export async function isBuyerApprovedForListing(
  options: BaseTransactionOptions<IsBuyerApprovedForListingParams>,
): Promise<boolean> {
  const listing = await getListing({
    contract: options.contract,
    listingId: options.listingId,
  });

  if (!listing.isReservedListing) {
    // if the listing is not reserved then *any* buyer is "approved"
    return true;
  }

  // otherwise we need to check if the buyer is the one who the listing is reserved for
  const { isBuyerApprovedForListing: generatedIsBuyerApprovedForListing } =
    await import(
      "../../__generated__/IDirectListings/read/isBuyerApprovedForListing.js"
    );
  return await generatedIsBuyerApprovedForListing({
    contract: options.contract,
    buyer: options.buyer,
    listingId: options.listingId,
  });
}
