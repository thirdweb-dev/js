import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the Initialized event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { initializedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  initializedEvent()
 * ],
 * });
 * ```
 */
export function initializedEvent() {
  return prepareEvent({
    signature: "event Initialized(uint64 version)",
  });
}
