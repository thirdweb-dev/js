import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RoyaltyEngineUpdated" event.
 */
export type RoyaltyEngineUpdatedEventFilters = Partial<{
  previousAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "previousAddress";
    indexed: true;
  }>;
  newAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "newAddress";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RoyaltyEngineUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension COMMON
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { royaltyEngineUpdatedEvent } from "thirdweb/extensions/common";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  royaltyEngineUpdatedEvent({
 *  previousAddress: ...,
 *  newAddress: ...,
 * })
 * ],
 * });
 * ```
 */
export function royaltyEngineUpdatedEvent(
  filters: RoyaltyEngineUpdatedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RoyaltyEngineUpdated(address indexed previousAddress, address indexed newAddress)",
    filters,
  });
}
