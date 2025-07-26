import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the RewardClaimed event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardClaimedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardClaimedEvent()
 * ],
 * });
 * ```
 */
export function rewardClaimedEvent() {
  return prepareEvent({
    signature:
      "event RewardClaimed(address rewardLocker, address asset, address claimer)",
  });
}
