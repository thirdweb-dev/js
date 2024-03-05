import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "CancelledOffer" event.
 */
export type CancelledOfferEventFilters = Partial<{
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
}>;

/**
 * Creates an event object for the CancelledOffer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { cancelledOfferEvent } from "thirdweb/extensions/marketplace";
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
export function cancelledOfferEvent(filters: CancelledOfferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event CancelledOffer(address indexed offeror, uint256 indexed offerId)",
    filters,
  });
}
