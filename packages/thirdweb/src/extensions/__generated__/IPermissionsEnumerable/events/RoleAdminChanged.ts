import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RoleAdminChanged" event.
 */
export type RoleAdminChangedFilters = {
  role: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  previousAdminRole: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "previousAdminRole";
    type: "bytes32";
  }>;
  newAdminRole: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "newAdminRole";
    type: "bytes32";
  }>;
};

/**
 * Creates an event object for the RoleAdminChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPERMISSIONSENUMERABLE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleAdminChangedEvent } from "thirdweb/extensions/IPermissionsEnumerable";
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
export function roleAdminChangedEvent(filters: RoleAdminChangedFilters = {}) {
  return prepareEvent({
    signature:
      "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
    filters,
  });
}
