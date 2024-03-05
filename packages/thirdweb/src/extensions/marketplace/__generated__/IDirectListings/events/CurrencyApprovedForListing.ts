import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "CurrencyApprovedForListing" event.
 */
export type CurrencyApprovedForListingEventFilters = Partial<{
  listingId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "listingId";
    type: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "currency";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the CurrencyApprovedForListing event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```
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
