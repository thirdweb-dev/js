import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ListingAdded" event.
 */
export type ListingAddedEventFilters = Partial<{
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
  lister: AbiParameterToPrimitiveType<{
    type: "address";
    name: "lister";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ListingAdded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { listingAddedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  listingAddedEvent({
 *  listingId: ...,
 *  assetContract: ...,
 *  lister: ...,
 * })
 * ],
 * });
 * ```
 */
export function listingAddedEvent(filters: ListingAddedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ListingAdded(uint256 indexed listingId, address indexed assetContract, address indexed lister, (uint256 listingId, address tokenOwner, address assetContract, uint256 tokenId, uint256 startTime, uint256 endTime, uint256 quantity, address currency, uint256 reservePricePerToken, uint256 buyoutPricePerToken, uint8 tokenType, uint8 listingType) listing)",
    filters,
  });
}
