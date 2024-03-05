import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedRewardRatio event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedRewardRatioEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedRewardRatioEvent()
 * ],
 * });
 * ```
 */
export function updatedRewardRatioEvent() {
  return prepareEvent({
    signature:
      "event UpdatedRewardRatio(uint256 oldNumerator, uint256 newNumerator, uint256 oldDenominator, uint256 newDenominator)",
  });
}
