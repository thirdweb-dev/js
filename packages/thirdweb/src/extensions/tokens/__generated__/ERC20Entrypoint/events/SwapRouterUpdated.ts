import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SwapRouterUpdated event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { swapRouterUpdatedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  swapRouterUpdatedEvent()
 * ],
 * });
 * ```
 */
export function swapRouterUpdatedEvent() {
  return prepareEvent({
    signature: "event SwapRouterUpdated(address swapRouter)",
  });
}
