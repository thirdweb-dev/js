import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataUpdate event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { metadataUpdateEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  metadataUpdateEvent()
 * ],
 * });
 * ```
 */
export function metadataUpdateEvent() {
  return prepareEvent({
    signature: "event MetadataUpdate(uint256 _tokenId)",
  });
}
