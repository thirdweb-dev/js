import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewOffer" event.
 */
export type NewOfferEventFilters = Partial<{
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
 *  offeror: ...,
 *  offerId: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function newOfferEvent(filters: NewOfferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event NewOffer(address indexed offeror, uint256 indexed offerId, address indexed assetContract, (uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status) offer)",
    filters,
  });
}
