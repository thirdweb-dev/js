import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SharedMetadataUpdated event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { sharedMetadataUpdatedEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  sharedMetadataUpdatedEvent()
 * ],
 * });
 * ```
 */
export function sharedMetadataUpdatedEvent() {
  return prepareEvent({
    signature:
      "event SharedMetadataUpdated(string name, string description, string imageURI, string animationURI)",
  });
}
