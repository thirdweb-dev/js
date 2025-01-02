import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PrimarySaleRecipientUpdated" event.
 */
export type PrimarySaleRecipientUpdatedEventFilters = Partial<{
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PrimarySaleRecipientUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension COMMON
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { primarySaleRecipientUpdatedEvent } from "thirdweb/extensions/common";
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
  filters: PrimarySaleRecipientUpdatedEventFilters = {},
) {
  return prepareEvent({
    signature: "event PrimarySaleRecipientUpdated(address indexed recipient)",
    filters,
  });
}
