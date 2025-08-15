import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the RewardLockerUpdated event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardLockerUpdatedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardLockerUpdatedEvent()
 * ],
 * });
 * ```
 */
export function rewardLockerUpdatedEvent() {
  return prepareEvent({
    signature: "event RewardLockerUpdated(address locker)",
  });
}
