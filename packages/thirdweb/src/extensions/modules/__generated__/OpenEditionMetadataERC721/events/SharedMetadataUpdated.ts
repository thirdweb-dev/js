import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SharedMetadataUpdated event.
 * @returns The prepared event object.
 * @modules OpenEditionMetadataERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  OpenEditionMetadataERC721.sharedMetadataUpdatedEvent()
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
