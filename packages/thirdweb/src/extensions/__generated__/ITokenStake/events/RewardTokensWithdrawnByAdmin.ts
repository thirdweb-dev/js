import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the RewardTokensWithdrawnByAdmin event.
 * @returns The prepared event object.
 * @extension ITOKENSTAKE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { rewardTokensWithdrawnByAdminEvent } from "thirdweb/extensions/ITokenStake";
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
