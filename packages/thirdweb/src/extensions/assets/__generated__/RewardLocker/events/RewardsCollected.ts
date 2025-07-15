import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RewardsCollected" event.
 */
export type RewardsCollectedEventFilters = Partial<{
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
 * Creates an event object for the RewardsCollected event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardsCollectedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardsCollectedEvent({
 *  owner: ...,
 *  asset: ...,
 * })
 * ],
 * });
 * ```
 */
export function rewardsCollectedEvent(
  filters: RewardsCollectedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RewardsCollected(address indexed owner, address indexed asset, address positionManager, uint256 tokenId, uint256 amount0, uint256 amount1)",
    filters,
  });
}
