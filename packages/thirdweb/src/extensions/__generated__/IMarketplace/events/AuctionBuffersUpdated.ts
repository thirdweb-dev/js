import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the AuctionBuffersUpdated event.
 * @returns The prepared event object.
 * @extension IMARKETPLACE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { auctionBuffersUpdatedEvent } from "thirdweb/extensions/IMarketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  auctionBuffersUpdatedEvent()
 * ],
 * });
 * ```
 */
export function auctionBuffersUpdatedEvent() {
  return prepareEvent({
    signature:
      "event AuctionBuffersUpdated(uint256 timeBuffer, uint256 bidBufferBps)",
  });
}
