//--------------------------------------------------
// Permissions
// --------------------------------------------------------

// READ
export {
  hasRole,
  type HasRoleParams,
} from "../../extensions/permissions/read/hasRole.js";
export {
  getRoleAdmin,
  type GetRoleAdminParams,
} from "../../extensions/permissions/read/getRoleAdmin.js";

// WRITE
export {
  grantRole,
  type GrantRoleParams,
} from "../../extensions/permissions/write/grant.js";
export {
  revokeRole,
  type RevokeRoleParams,
} from "../../extensions/permissions/write/revokeRole.js";
export {
  renounceRole,
  type RenounceRoleParams,
} from "../../extensions/permissions/write/renounceRole.js";

// EVENTS
export {
  roleGrantedEvent,
  type RoleGrantedEventFilters,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleGranted.js";
export {
  roleRevokedEvent,
  type RoleRevokedEventFilters,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleRevoked.js";
export {
  roleAdminChangedEvent,
  type RoleAdminChangedEventFilters,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleAdminChanged.js";

// --------------------------------------------------------
// PermissionsEnumerable
// --------------------------------------------------------

// READ
export {
  getRoleMember,
  type GetRoleMemberParams,
} from "../../extensions/permissions/read/getRoleMember.js";
export {
  getRoleMemberCount,
  type GetRoleMemberCountParams,
} from "../../extensions/permissions/read/getRoleMemberCount.js";
export {
  getAllRoleMembers,
  type GetAllRoleMembersParams,
} from "../../extensions/permissions/read/getAllMembers.js";
