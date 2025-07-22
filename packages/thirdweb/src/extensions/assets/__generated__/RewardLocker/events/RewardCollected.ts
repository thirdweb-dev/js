import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "RewardCollected" event.
 */
export type RewardCollectedEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "owner";
    indexed: true;
  }>;
  asset: AbiParameterToPrimitiveType<{
    type: "address";
    name: "asset";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RewardCollected event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardCollectedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardCollectedEvent({
 *  owner: ...,
 *  asset: ...,
 * })
 * ],
 * });
 * ```
 */
export function rewardCollectedEvent(
  filters: RewardCollectedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RewardCollected(address indexed owner, address indexed asset, address positionManager, uint256 tokenId, uint256 amount0, uint256 amount1)",
    filters,
  });
}
