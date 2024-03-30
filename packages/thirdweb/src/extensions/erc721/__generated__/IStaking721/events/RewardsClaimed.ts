import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RewardsClaimed" event.
 */
export type RewardsClaimedEventFilters = Partial<{
  staker: AbiParameterToPrimitiveType<{
    type: "address";
    name: "staker";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RewardsClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardsClaimedEvent } from "thirdweb/extensions/erc721";
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
export function rewardsClaimedEvent(filters: RewardsClaimedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event RewardsClaimed(address indexed staker, uint256 rewardAmount)",
    filters,
  });
}
