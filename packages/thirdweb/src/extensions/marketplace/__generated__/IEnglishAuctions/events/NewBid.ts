import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewBid" event.
 */
export type NewBidEventFilters = Partial<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "auctionId";
    indexed: true;
  }>;
  bidder: AbiParameterToPrimitiveType<{
    type: "address";
    name: "bidder";
    indexed: true;
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "assetContract";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the NewBid event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { newBidEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newBidEvent({
 *  auctionId: ...,
 *  bidder: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function newBidEvent(filters: NewBidEventFilters = {}) {
  return prepareEvent({
    signature:
      "event NewBid(uint256 indexed auctionId, address indexed bidder, address indexed assetContract, uint256 bidAmount, (uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status) auction)",
    filters,
  });
}
