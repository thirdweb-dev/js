import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "OwnershipTransferred" event.
 */
export type OwnershipTransferredEventFilters = Partial<{
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
 * Creates an event object for the OwnershipTransferred event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownershipTransferredEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipTransferredEvent({
 *  oldOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipTransferredEvent(
  filters: OwnershipTransferredEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event OwnershipTransferred(address indexed oldOwner, address indexed newOwner)",
    filters,
  });
}
