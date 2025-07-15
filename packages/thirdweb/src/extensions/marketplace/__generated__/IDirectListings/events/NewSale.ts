import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewSale" event.
 */
export type NewSaleEventFilters = Partial<{
  listingCreator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "listingCreator";
    indexed: true;
  }>;
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "listingId";
    indexed: true;
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    type: "address";
    name: "assetContract";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the NewSale event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { newSaleEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newSaleEvent({
 *  listingCreator: ...,
 *  listingId: ...,
 *  assetContract: ...,
 * })
 * ],
 * });
 * ```
 */
export function newSaleEvent(filters: NewSaleEventFilters = {}) {
  return prepareEvent({
    signature:
      "event NewSale(address indexed listingCreator, uint256 indexed listingId, address indexed assetContract, uint256 tokenId, address buyer, uint256 quantityBought, uint256 totalPricePaid)",
    filters,
  });
}
