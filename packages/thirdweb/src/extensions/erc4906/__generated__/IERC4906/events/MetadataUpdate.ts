import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataUpdate event.
 * @returns The prepared event object.
 * @extension ERC4906
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { metadataUpdateEvent } from "thirdweb/extensions/erc4906";
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
