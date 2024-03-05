import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RewardsClaimed" event.
 */
export type RewardsClaimedEventFilters = Partial<{
  staker: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "staker";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the RewardsClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { rewardsClaimedEvent } from "thirdweb/extensions/erc1155";
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
