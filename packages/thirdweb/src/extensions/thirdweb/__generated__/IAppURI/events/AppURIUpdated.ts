import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AppURIUpdated event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { appURIUpdatedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  appURIUpdatedEvent()
 * ],
 * });
 * ```
 */
export function appURIUpdatedEvent() {
  return prepareEvent({
    signature: "event AppURIUpdated(string prevURI, string newURI)",
  });
}
