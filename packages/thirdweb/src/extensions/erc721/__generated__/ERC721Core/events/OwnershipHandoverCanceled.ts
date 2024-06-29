import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "OwnershipHandoverCanceled" event.
 */
export type OwnershipHandoverCanceledEventFilters = Partial<{
  pendingOwner: AbiParameterToPrimitiveType<{
    name: "pendingOwner";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the OwnershipHandoverCanceled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownershipHandoverCanceledEvent } from "thirdweb/extensions/erc721";
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
    signature: "event OwnershipHandoverCanceled(address indexed pendingOwner)",
    filters,
  });
}
