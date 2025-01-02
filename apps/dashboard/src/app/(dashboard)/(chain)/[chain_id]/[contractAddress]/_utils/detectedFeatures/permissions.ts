import * as PermissionsExt from "thirdweb/extensions/permissions";

export function isPermissionsSupported(functionSelectors: string[]) {
  return [
    PermissionsExt.isGetRoleAdminSupported(functionSelectors),
    PermissionsExt.isGrantRoleSupported(functionSelectors),
    PermissionsExt.isHasRoleSupported(functionSelectors),
    PermissionsExt.isRenounceRoleSupported(functionSelectors),
    PermissionsExt.isRevokeRoleSupported(functionSelectors),
  ].every(Boolean);
}

export function isPermissionsEnumerableSupported(functionSelectors: string[]) {
  return (
    isPermissionsSupported(functionSelectors) &&
    [
      PermissionsExt.isGetRoleMemberSupported(functionSelectors),
      PermissionsExt.isGetRoleMemberCountSupported(functionSelectors),
    ].every(Boolean)
  );
}
