import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewOffer" event.
 */
export type NewOfferEventFilters = Partial<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "listingId";
    indexed: true;
  }>;
  offeror: AbiParameterToPrimitiveType<{
    type: "address";
    name: "offeror";
    indexed: true;
  }>;
  listingType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "listingType";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the NewOffer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { newOfferEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newOfferEvent({
 *  listingId: ...,
 *  offeror: ...,
 *  listingType: ...,
 * })
 * ],
 * });
 * ```
 */
export function newOfferEvent(filters: NewOfferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event NewOffer(uint256 indexed listingId, address indexed offeror, uint8 indexed listingType, uint256 quantityWanted, uint256 totalOfferAmount, address currency)",
    filters,
  });
}
