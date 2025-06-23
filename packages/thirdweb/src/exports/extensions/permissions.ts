//--------------------------------------------------
// Permissions
// --------------------------------------------------------

export {
  type RoleAdminChangedEventFilters,
  roleAdminChangedEvent,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleAdminChanged.js";
// EVENTS
export {
  type RoleGrantedEventFilters,
  roleGrantedEvent,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleGranted.js";
export {
  type RoleRevokedEventFilters,
  roleRevokedEvent,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleRevoked.js";
export {
  type GetRoleAdminParams,
  getRoleAdmin,
  isGetRoleAdminSupported,
} from "../../extensions/permissions/read/getRoleAdmin.js";
// READ
export {
  type HasRoleParams,
  hasRole,
  isHasRoleSupported,
} from "../../extensions/permissions/read/hasRole.js";
// WRITE
export {
  type GrantRoleParams,
  grantRole,
  isGrantRoleSupported,
} from "../../extensions/permissions/write/grantRole.js";
export {
  isRenounceRoleSupported,
  type RenounceRoleParams,
  renounceRole,
} from "../../extensions/permissions/write/renounceRole.js";
export {
  isRevokeRoleSupported,
  type RevokeRoleParams,
  revokeRole,
} from "../../extensions/permissions/write/revokeRole.js";

// --------------------------------------------------------
// PermissionsEnumerable
// --------------------------------------------------------

export {
  type GetAllRoleMembersParams,
  getAllRoleMembers,
  isGetAllRoleMembersSupported,
} from "../../extensions/permissions/read/getAllMembers.js";
// READ
export {
  type GetRoleMemberParams,
  getRoleMember,
  isGetRoleMemberSupported,
} from "../../extensions/permissions/read/getRoleMember.js";
export {
  type GetRoleMemberCountParams,
  getRoleMemberCount,
  isGetRoleMemberCountSupported,
} from "../../extensions/permissions/read/getRoleMemberCount.js";

// --------------------------------------------------------
// Utils
// --------------------------------------------------------
export { getRoleHash, roleMap } from "../../extensions/permissions/utils.js";
