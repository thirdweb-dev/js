import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ListingRemoved" event.
 */
export type ListingRemovedEventFilters = Partial<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "listingId";
    indexed: true;
  }>;
  listingCreator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "listingCreator";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ListingRemoved event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { listingRemovedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  listingRemovedEvent({
 *  listingId: ...,
 *  listingCreator: ...,
 * })
 * ],
 * });
 * ```
 */
export function listingRemovedEvent(filters: ListingRemovedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ListingRemoved(uint256 indexed listingId, address indexed listingCreator)",
    filters,
  });
}
