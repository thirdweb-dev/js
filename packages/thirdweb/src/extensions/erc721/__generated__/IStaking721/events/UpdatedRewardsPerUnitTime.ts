import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedRewardsPerUnitTime event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { updatedRewardsPerUnitTimeEvent } from "thirdweb/extensions/erc721";
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
