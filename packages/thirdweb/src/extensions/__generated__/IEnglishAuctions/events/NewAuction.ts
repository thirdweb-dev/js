import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewAuction" event.
 */
export type NewAuctionFilters = {
  auctionCreator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "auctionCreator";
    type: "address";
  }>;
  auctionId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "auctionId";
    type: "uint256";
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "assetContract";
    type: "address";
  }>;
};

/**
 * Creates an event object for the NewAuction event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IENGLISHAUCTIONS
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { newAuctionEvent } from "thirdweb/extensions/IEnglishAuctions";
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
export function newAuctionEvent(filters: NewAuctionFilters = {}) {
  return prepareEvent({
    signature:
      "event NewAuction(address indexed auctionCreator, uint256 indexed auctionId, address indexed assetContract, (uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status) auction)",
    filters,
  });
}
