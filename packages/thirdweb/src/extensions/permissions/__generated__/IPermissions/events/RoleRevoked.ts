import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RoleRevoked" event.
 */
export type RoleRevokedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "role";
    indexed: true;
  }>;
  account: AbiParameterToPrimitiveType<{
    type: "address";
    name: "account";
    indexed: true;
  }>;
  sender: AbiParameterToPrimitiveType<{
    type: "address";
    name: "sender";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RoleRevoked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { roleRevokedEvent } from "thirdweb/extensions/permissions";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleRevokedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleRevokedEvent(filters: RoleRevokedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
}
