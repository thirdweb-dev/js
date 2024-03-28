import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewListing" event.
 */
export type NewListingEventFilters = Partial<{
  listingCreator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "listingCreator";
    indexed: true;
  }>;
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "listingId";
    indexed: true;
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "assetContract";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the NewListing event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { newListingEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newListingEvent({
 *  listingCreator: ...,
 *  listingId: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function newListingEvent(filters: NewListingEventFilters = {}) {
  return prepareEvent({
    signature:
      "event NewListing(address indexed listingCreator, uint256 indexed listingId, address indexed assetContract, (uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved) listing)",
    filters,
  });
}
