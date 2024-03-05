import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedTimeUnit event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedTimeUnitEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedTimeUnitEvent()
 * ],
 * });
 * ```
 */
export function updatedTimeUnitEvent() {
  return prepareEvent({
    signature:
      "event UpdatedTimeUnit(uint256 oldTimeUnit, uint256 newTimeUnit)",
  });
}
