import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the BatchMetadataUpdate event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { batchMetadataUpdateEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  batchMetadataUpdateEvent()
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
