import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getListing } from "./getListing.js";

export type IsBuyerApprovedForListingParams = {
  listingId: bigint;
  buyer: Address;
};

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
