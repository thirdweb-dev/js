import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the RewardTokensWithdrawnByAdmin event.
 * @returns The prepared event object.
 * @extension INFTSTAKE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { rewardTokensWithdrawnByAdminEvent } from "thirdweb/extensions/INFTStake";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardTokensWithdrawnByAdminEvent()
 * ],
 * });
 * ```
 */
export function rewardTokensWithdrawnByAdminEvent() {
  return prepareEvent({
    signature: "event RewardTokensWithdrawnByAdmin(uint256 _amount)",
  });
}
