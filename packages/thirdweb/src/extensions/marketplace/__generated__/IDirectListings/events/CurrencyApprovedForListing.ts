import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "CurrencyApprovedForListing" event.
 */
export type CurrencyApprovedForListingEventFilters = Partial<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "listingId";
    indexed: true;
  }>;
  currency: AbiParameterToPrimitiveType<{
    type: "address";
    name: "currency";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the CurrencyApprovedForListing event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { currencyApprovedForListingEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  currencyApprovedForListingEvent({
 *  listingId: ...,
 *  currency: ...,
 * })
 * ],
 * });
 * ```
 */
export function currencyApprovedForListingEvent(
  filters: CurrencyApprovedForListingEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event CurrencyApprovedForListing(uint256 indexed listingId, address indexed currency, uint256 pricePerToken)",
    filters,
  });
}
