import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RolesUpdated" event.
 */
export type RolesUpdatedEventFilters = Partial<{
  user: AbiParameterToPrimitiveType<{
    type: "address";
    name: "user";
    indexed: true;
  }>;
  roles: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "roles";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RolesUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rolesUpdatedEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rolesUpdatedEvent({
 *  user: ...,
 *  roles: ...,
 * })
 * ],
 * });
 * ```
 */
export function rolesUpdatedEvent(filters: RolesUpdatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event RolesUpdated(address indexed user, uint256 indexed roles)",
    filters,
  });
}
