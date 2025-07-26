import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the PoolRouterUpdated event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { poolRouterUpdatedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  poolRouterUpdatedEvent()
 * ],
 * });
 * ```
 */
export function poolRouterUpdatedEvent() {
  return prepareEvent({
    signature: "event PoolRouterUpdated(address poolRouter)",
  });
}
