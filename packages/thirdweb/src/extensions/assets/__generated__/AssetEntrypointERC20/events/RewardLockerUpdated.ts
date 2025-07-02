import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "RewardLockerUpdated" event.
 */
export type RewardLockerUpdatedEventFilters = Partial<{
  locker: AbiParameterToPrimitiveType<{
    type: "address";
    name: "locker";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RewardLockerUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardLockerUpdatedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardLockerUpdatedEvent({
 *  locker: ...,
 * })
 * ],
 * });
 * ```
 */
export function rewardLockerUpdatedEvent(
  filters: RewardLockerUpdatedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature: "event RewardLockerUpdated(address indexed locker)",
  });
}
