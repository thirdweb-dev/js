import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the Paused event.
 * @returns The prepared event object.
 * @extension ICONTRACTPUBLISHER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { pausedEvent } from "thirdweb/extensions/IContractPublisher";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  pausedEvent()
 * ],
 * });
 * ```
 */
export function pausedEvent() {
  return prepareEvent({
    signature: "event Paused(bool isPaused)",
  });
}
