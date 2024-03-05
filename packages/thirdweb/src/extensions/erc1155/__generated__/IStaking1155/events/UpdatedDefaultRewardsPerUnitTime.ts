import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedDefaultRewardsPerUnitTime event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedDefaultRewardsPerUnitTimeEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedDefaultRewardsPerUnitTimeEvent()
 * ],
 * });
 * ```
 */
export function updatedDefaultRewardsPerUnitTimeEvent() {
  return prepareEvent({
    signature:
      "event UpdatedDefaultRewardsPerUnitTime(uint256 oldRewardsPerUnitTime, uint256 newRewardsPerUnitTime)",
  });
}
