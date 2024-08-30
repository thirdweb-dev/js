import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataUpdate event.
 * @returns The prepared event object.
 * @module SimpleMetadataERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { SimpleMetadataERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  SimpleMetadataERC721.metadataUpdateEvent()
 * ],
 * });
 * ```
 */
export function metadataUpdateEvent() {
  return prepareEvent({
    signature: "event MetadataUpdate(uint256 id)",
  });
}
