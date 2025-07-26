import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "OwnerChanged" event.
 */
export type OwnerChangedEventFilters = Partial<{
  oldOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "oldOwner";
    indexed: true;
  }>;
  newOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "newOwner";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the OwnerChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownerChangedEvent } from "thirdweb/extensions/uniswap";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownerChangedEvent({
 *  oldOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownerChangedEvent(filters: OwnerChangedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event OwnerChanged(address indexed oldOwner, address indexed newOwner)",
    filters,
  });
}
