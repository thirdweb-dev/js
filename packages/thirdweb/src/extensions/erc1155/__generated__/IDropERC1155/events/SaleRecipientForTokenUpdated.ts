import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SaleRecipientForTokenUpdated" event.
 */
export type SaleRecipientForTokenUpdatedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the SaleRecipientForTokenUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { saleRecipientForTokenUpdatedEvent } from "thirdweb/extensions/erc1155";
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
  filters: SaleRecipientForTokenUpdatedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event SaleRecipientForTokenUpdated(uint256 indexed tokenId, address saleRecipient)",
    filters,
  });
}
