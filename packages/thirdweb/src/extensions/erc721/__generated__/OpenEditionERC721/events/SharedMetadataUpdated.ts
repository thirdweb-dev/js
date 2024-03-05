import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SharedMetadataUpdated event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { sharedMetadataUpdatedEvent } from "thirdweb/extensions/erc721";
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
