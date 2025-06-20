import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "CancelledListing" event.
 */
export type CancelledListingEventFilters = Partial<{
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
}>;

/**
 * Creates an event object for the CancelledListing event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { cancelledListingEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  cancelledListingEvent({
 *  listingCreator: ...,
 *  listingId: ...,
 * })
 * ],
 * });
 * ```
 */
export function cancelledListingEvent(
  filters: CancelledListingEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event CancelledListing(address indexed listingCreator, uint256 indexed listingId)",
  });
}
