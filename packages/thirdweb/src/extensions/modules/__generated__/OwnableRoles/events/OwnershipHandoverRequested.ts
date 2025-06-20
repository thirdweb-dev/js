import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "OwnershipHandoverRequested" event.
 */
export type OwnershipHandoverRequestedEventFilters = Partial<{
  pendingOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "pendingOwner";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the OwnershipHandoverRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULES
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownershipHandoverRequestedEvent } from "thirdweb/extensions/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipHandoverRequestedEvent({
 *  pendingOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipHandoverRequestedEvent(
  filters: OwnershipHandoverRequestedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature: "event OwnershipHandoverRequested(address indexed pendingOwner)",
  });
}
