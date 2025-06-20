import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

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
 * @extension MODULES
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rolesUpdatedEvent } from "thirdweb/extensions/modules";
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
    filters,
    signature:
      "event RolesUpdated(address indexed user, uint256 indexed roles)",
  });
}
