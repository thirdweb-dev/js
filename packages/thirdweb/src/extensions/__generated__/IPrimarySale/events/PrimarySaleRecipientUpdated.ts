import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PrimarySaleRecipientUpdated" event.
 */
export type PrimarySaleRecipientUpdatedFilters = {
  recipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "recipient";
    type: "address";
  }>;
};

/**
 * Creates an event object for the PrimarySaleRecipientUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPRIMARYSALE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { primarySaleRecipientUpdatedEvent } from "thirdweb/extensions/IPrimarySale";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  primarySaleRecipientUpdatedEvent({
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function primarySaleRecipientUpdatedEvent(
  filters: PrimarySaleRecipientUpdatedFilters = {},
) {
  return prepareEvent({
    signature: "event PrimarySaleRecipientUpdated(address indexed recipient)",
    filters,
  });
}
