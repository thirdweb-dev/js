import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RoleAdminChanged" event.
 */
export type RoleAdminChangedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "role";
    indexed: true;
  }>;
  previousAdminRole: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "previousAdminRole";
    indexed: true;
  }>;
  newAdminRole: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "newAdminRole";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RoleAdminChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { roleAdminChangedEvent } from "thirdweb/extensions/permissions";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleAdminChangedEvent({
 *  role: ...,
 *  previousAdminRole: ...,
 *  newAdminRole: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleAdminChangedEvent(
  filters: RoleAdminChangedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
    filters,
  });
}
