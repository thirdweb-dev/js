import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataUpdate event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { metadataUpdateEvent } from "thirdweb/extensions/modular";
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
    signature: "event MetadataUpdate(uint256 id)",
  });
}
