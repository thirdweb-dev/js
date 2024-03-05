import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "CancelledListing" event.
 */
export type CancelledListingFilters = {
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
};

/**
 * Creates an event object for the CancelledListing event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IDIRECTLISTINGS
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { cancelledListingEvent } from "thirdweb/extensions/IDirectListings";
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
export function cancelledListingEvent(filters: CancelledListingFilters = {}) {
  return prepareEvent({
    signature:
      "event CancelledListing(address indexed listingCreator, uint256 indexed listingId)",
    filters,
  });
}
