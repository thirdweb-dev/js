import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "OwnershipHandoverRequested" event.
 */
export type OwnershipHandoverRequestedEventFilters = Partial<{
  pendingOwner: AbiParameterToPrimitiveType<{
    name: "pendingOwner";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the OwnershipHandoverRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownershipHandoverRequestedEvent } from "thirdweb/extensions/modular";
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
    signature: "event OwnershipHandoverRequested(address indexed pendingOwner)",
    filters,
  });
}
