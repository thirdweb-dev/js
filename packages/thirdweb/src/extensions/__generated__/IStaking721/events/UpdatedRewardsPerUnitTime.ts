import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedRewardsPerUnitTime event.
 * @returns The prepared event object.
 * @extension ISTAKING721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedRewardsPerUnitTimeEvent } from "thirdweb/extensions/IStaking721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedRewardsPerUnitTimeEvent()
 * ],
 * });
 * ```
 */
export function updatedRewardsPerUnitTimeEvent() {
  return prepareEvent({
    signature:
      "event UpdatedRewardsPerUnitTime(uint256 oldRewardsPerUnitTime, uint256 newRewardsPerUnitTime)",
  });
}
