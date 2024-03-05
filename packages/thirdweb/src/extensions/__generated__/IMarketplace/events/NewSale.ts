import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewSale" event.
 */
export type NewSaleFilters = {
  listingId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "listingId";
    type: "uint256";
  }>;
  assetContract: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "assetContract";
    type: "address";
  }>;
  lister: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "lister";
    type: "address";
  }>;
};

/**
 * Creates an event object for the NewSale event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IMARKETPLACE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { newSaleEvent } from "thirdweb/extensions/IMarketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newSaleEvent({
 *  listingId: ...,
 *  assetContract: ...,
 *  lister: ...,
 * })
 * ],
 * });
 * ```
 */
export function newSaleEvent(filters: NewSaleFilters = {}) {
  return prepareEvent({
    signature:
      "event NewSale(uint256 indexed listingId, address indexed assetContract, address indexed lister, address buyer, uint256 quantityBought, uint256 totalPricePaid)",
    filters,
  });
}
