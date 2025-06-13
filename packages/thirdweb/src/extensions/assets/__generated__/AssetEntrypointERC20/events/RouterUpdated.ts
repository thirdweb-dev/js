import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RouterUpdated" event.
 */
export type RouterUpdatedEventFilters = Partial<{
  router: AbiParameterToPrimitiveType<{
    type: "address";
    name: "router";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RouterUpdated event.
 * @param filters - Optional filters to apply to the event.
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
 *  routerUpdatedEvent({
 *  router: ...,
 * })
 * ],
 * });
 * ```
 */
export function routerUpdatedEvent(filters: RouterUpdatedEventFilters = {}) {
  return prepareEvent({
    signature: "event RouterUpdated(address indexed router)",
    filters,
  });
}
