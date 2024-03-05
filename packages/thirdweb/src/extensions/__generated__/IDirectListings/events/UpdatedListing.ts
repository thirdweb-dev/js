import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UpdatedListing" event.
 */
export type UpdatedListingFilters = {
  listingCreator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "listingCreator";
    type: "address";
  }>;
  listingId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "listingId";
    type: "uint256";
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "assetContract";
    type: "address";
  }>;
};

/**
 * Creates an event object for the UpdatedListing event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedListingEvent } from "thirdweb/extensions/IDirectListings";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedListingEvent({
 *  listingCreator: ...,
 *  listingId: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function updatedListingEvent(filters: UpdatedListingFilters = {}) {
  return prepareEvent({
    signature:
      "event UpdatedListing(address indexed listingCreator, uint256 indexed listingId, address indexed assetContract, (uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved) listing)",
    filters,
  });
}
