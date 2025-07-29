import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AdapterEnabled event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { adapterEnabledEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  adapterEnabledEvent()
 * ],
 * });
 * ```
 */
export function adapterEnabledEvent() {
  return prepareEvent({
    signature: "event AdapterEnabled(uint8 adapterType, address rewardLocker)",
  });
}
