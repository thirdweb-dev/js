import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataUpdate event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { metadataUpdateEvent } from "thirdweb/extensions/erc1155";
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
