import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AcceptedOffer" event.
 */
export type AcceptedOfferEventFilters = Partial<{
  offeror: AbiParameterToPrimitiveType<{
    type: "address";
    name: "offeror";
    indexed: true;
  }>;
  offerId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "offerId";
    indexed: true;
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "assetContract";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the AcceptedOffer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { acceptedOfferEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  acceptedOfferEvent({
 *  offeror: ...,
 *  offerId: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function acceptedOfferEvent(filters: AcceptedOfferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event AcceptedOffer(address indexed offeror, uint256 indexed offerId, address indexed assetContract, uint256 tokenId, address seller, uint256 quantityBought, uint256 totalPricePaid)",
    filters,
  });
}
