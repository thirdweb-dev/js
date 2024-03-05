import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the AppURIUpdated event.
 * @returns The prepared event object.
 * @extension IAPPURI
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { appURIUpdatedEvent } from "thirdweb/extensions/IAppURI";
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
