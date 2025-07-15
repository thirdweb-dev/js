import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the RouterUpdated event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { routerUpdatedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  routerUpdatedEvent()
 * ],
 * });
 * ```
 */
export function routerUpdatedEvent() {
  return prepareEvent({
    signature: "event RouterUpdated(address router)",
  });
}
