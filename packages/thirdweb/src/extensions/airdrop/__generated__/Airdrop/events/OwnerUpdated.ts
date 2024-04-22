import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "OwnerUpdated" event.
 */
export type OwnerUpdatedEventFilters = Partial<{
  prevOwner: AbiParameterToPrimitiveType<{
    name: "prevOwner";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  newOwner: AbiParameterToPrimitiveType<{
    name: "newOwner";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the OwnerUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ownerUpdatedEvent } from "thirdweb/extensions/airdrop";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownerUpdatedEvent({
 *  prevOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownerUpdatedEvent(filters: OwnerUpdatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event OwnerUpdated(address indexed prevOwner, address indexed newOwner)",
    filters,
  });
}
