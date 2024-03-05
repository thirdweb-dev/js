import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MetadataFrozen event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { metadataFrozenEvent } from "thirdweb/extensions/erc1155";
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
