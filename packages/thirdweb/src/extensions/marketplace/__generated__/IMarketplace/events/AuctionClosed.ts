import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AuctionClosed" event.
 */
export type AuctionClosedEventFilters = Partial<{
  listingId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "listingId";
    type: "uint256";
  }>;
  closer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "closer";
    type: "address";
  }>;
  cancelled: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bool";
    name: "cancelled";
    type: "bool";
  }>;
}>;

/**
 * Creates an event object for the AuctionClosed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { auctionClosedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  auctionClosedEvent({
 *  listingId: ...,
 *  closer: ...,
 *  cancelled: ...,
 * })
 * ],
 * });
 * ```
 */
export function auctionClosedEvent(filters: AuctionClosedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event AuctionClosed(uint256 indexed listingId, address indexed closer, bool indexed cancelled, address auctionCreator, address winningBidder)",
    filters,
  });
}
