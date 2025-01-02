import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewAuction" event.
 */
export type NewAuctionEventFilters = Partial<{
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
  assetContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "assetContract";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the NewAuction event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { newAuctionEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newAuctionEvent({
 *  auctionCreator: ...,
 *  auctionId: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function newAuctionEvent(filters: NewAuctionEventFilters = {}) {
  return prepareEvent({
    signature:
      "event NewAuction(address indexed auctionCreator, uint256 indexed auctionId, address indexed assetContract, (uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status) auction)",
    filters,
  });
}
