import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "OwnershipHandoverCanceled" event.
 */
export type OwnershipHandoverCanceledEventFilters = Partial<{
  pendingOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "pendingOwner";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the OwnershipHandoverCanceled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULES
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownershipHandoverCanceledEvent } from "thirdweb/extensions/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipHandoverCanceledEvent({
 *  pendingOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipHandoverCanceledEvent(
  filters: OwnershipHandoverCanceledEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature: "event OwnershipHandoverCanceled(address indexed pendingOwner)",
  });
}
