import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the BatchMetadataUpdate event.
 * @returns The prepared event object.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  BatchMetadataERC721.batchMetadataUpdateEvent()
 * ],
 * });
 * ```
 */
export function batchMetadataUpdateEvent() {
  return prepareEvent({
    signature:
      "event BatchMetadataUpdate(uint256 startTokenIdIncluside, uint256 endTokenIdInclusive, string baseURI)",
  });
}
