import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataFrozen event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { metadataFrozenEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  metadataFrozenEvent()
 * ],
 * });
 * ```
 */
export function metadataFrozenEvent() {
  return prepareEvent({
    signature: "event MetadataFrozen()",
  });
}
