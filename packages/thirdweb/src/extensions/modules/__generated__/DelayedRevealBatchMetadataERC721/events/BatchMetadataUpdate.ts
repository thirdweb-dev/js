import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the BatchMetadataUpdate event.
 * @returns The prepared event object.
 * @module DelayedRevealBatchMetadataERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { DelayedRevealBatchMetadataERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  DelayedRevealBatchMetadataERC721.batchMetadataUpdateEvent()
 * ],
 * });
 * ```
 */
export function batchMetadataUpdateEvent() {
  return prepareEvent({
    signature:
      "event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)",
  });
}
