import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the FeeRecipientUpdated event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { feeRecipientUpdatedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  feeRecipientUpdatedEvent()
 * ],
 * });
 * ```
 */
export function feeRecipientUpdatedEvent() {
  return prepareEvent({
    signature: "event FeeRecipientUpdated(address feeRecipient)",
  });
}
