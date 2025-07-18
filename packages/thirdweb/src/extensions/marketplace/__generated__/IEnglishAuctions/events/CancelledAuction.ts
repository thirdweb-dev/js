import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "CancelledAuction" event.
 */
export type CancelledAuctionEventFilters = Partial<{
  auctionCreator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "auctionCreator";
    indexed: true;
  }>;
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "auctionId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the CancelledAuction event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { cancelledAuctionEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  cancelledAuctionEvent({
 *  auctionCreator: ...,
 *  auctionId: ...,
 * })
 * ],
 * });
 * ```
 */
export function cancelledAuctionEvent(
  filters: CancelledAuctionEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event CancelledAuction(address indexed auctionCreator, uint256 indexed auctionId)",
    filters,
  });
}
