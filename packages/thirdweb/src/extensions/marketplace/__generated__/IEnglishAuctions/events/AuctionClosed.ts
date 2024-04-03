import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AuctionClosed" event.
 */
export type AuctionClosedEventFilters = Partial<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "auctionId";
    indexed: true;
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "assetContract";
    indexed: true;
  }>;
  closer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "closer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the AuctionClosed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { auctionClosedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  auctionClosedEvent({
 *  auctionId: ...,
 *  assetContract: ...,
 *  closer: ...,
 * })
 * ],
 * });
 * ```
 */
export function auctionClosedEvent(filters: AuctionClosedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event AuctionClosed(uint256 indexed auctionId, address indexed assetContract, address indexed closer, uint256 tokenId, address auctionCreator, address winningBidder)",
    filters,
  });
}
