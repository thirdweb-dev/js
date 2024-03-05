import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SaleRecipientForTokenUpdated" event.
 */
export type SaleRecipientForTokenUpdatedFilters = {
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the SaleRecipientForTokenUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IDROPERC1155_V2
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { saleRecipientForTokenUpdatedEvent } from "thirdweb/extensions/IDropERC1155_V2";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  saleRecipientForTokenUpdatedEvent({
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function saleRecipientForTokenUpdatedEvent(
  filters: SaleRecipientForTokenUpdatedFilters = {},
) {
  return prepareEvent({
    signature:
      "event SaleRecipientForTokenUpdated(uint256 indexed tokenId, address saleRecipient)",
    filters,
  });
}
