import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewBid" event.
 */
export type NewBidFilters = {
  auctionId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "auctionId";
    type: "uint256";
  }>;
  bidder: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "bidder";
    type: "address";
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "assetContract";
    type: "address";
  }>;
};

/**
 * Creates an event object for the NewBid event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IENGLISHAUCTIONS
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { newBidEvent } from "thirdweb/extensions/IEnglishAuctions";
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
export function newBidEvent(filters: NewBidFilters = {}) {
  return prepareEvent({
    signature:
      "event NewBid(uint256 indexed auctionId, address indexed bidder, address indexed assetContract, uint256 bidAmount, (uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status) auction)",
    filters,
  });
}
