import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedDefaultTimeUnit event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedDefaultTimeUnitEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedDefaultTimeUnitEvent()
 * ],
 * });
 * ```
 */
export function updatedDefaultTimeUnitEvent() {
  return prepareEvent({
    signature:
      "event UpdatedDefaultTimeUnit(uint256 oldTimeUnit, uint256 newTimeUnit)",
  });
}
