import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ListingUpdated" event.
 */
export type ListingUpdatedEventFilters = Partial<{
  listingId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "listingId";
    type: "uint256";
  }>;
  listingCreator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "listingCreator";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the ListingUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { listingUpdatedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  listingUpdatedEvent({
 *  listingId: ...,
 *  listingCreator: ...,
 * })
 * ],
 * });
 * ```
 */
export function listingUpdatedEvent(filters: ListingUpdatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ListingUpdated(uint256 indexed listingId, address indexed listingCreator)",
    filters,
  });
}
