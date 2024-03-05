import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "CancelledOffer" event.
 */
export type CancelledOfferFilters = {
  offeror: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "offeror";
    type: "address";
  }>;
  offerId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "offerId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the CancelledOffer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IOFFERS
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { cancelledOfferEvent } from "thirdweb/extensions/IOffers";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  cancelledOfferEvent({
 *  offeror: ...,
 *  offerId: ...,
 * })
 * ],
 * });
 * ```
 */
export function cancelledOfferEvent(filters: CancelledOfferFilters = {}) {
  return prepareEvent({
    signature:
      "event CancelledOffer(address indexed offeror, uint256 indexed offerId)",
    filters,
  });
}
