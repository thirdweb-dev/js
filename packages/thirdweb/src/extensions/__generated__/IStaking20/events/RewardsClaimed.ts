import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RewardsClaimed" event.
 */
export type RewardsClaimedFilters = {
  staker: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "staker";
    type: "address";
  }>;
};

/**
 * Creates an event object for the RewardsClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKING20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { rewardsClaimedEvent } from "thirdweb/extensions/IStaking20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardsClaimedEvent({
 *  staker: ...,
 * })
 * ],
 * });
 * ```
 */
export function rewardsClaimedEvent(filters: RewardsClaimedFilters = {}) {
  return prepareEvent({
    signature:
      "event RewardsClaimed(address indexed staker, uint256 rewardAmount)",
    filters,
  });
}
