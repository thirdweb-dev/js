import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getRoleAdmin as generatedGetRoleAdmin } from "../__generated__/IPermissions/read/getRoleAdmin.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type GetRoleAdminParams = {
  role: RoleInput;
};

/**
 * Gets the admin of a role.
 *
 * @param options - The options for getting the role's admin.
 * @returns The address of the role's admin.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { getRoleAdmin } from "thirdweb/extensions/permissions";
 *
 * const result = await getRoleAdmin({
 *  contract,
 *  role: "admin",
 * });
 */
export function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>,
): Promise<string> {
  return generatedGetRoleAdmin({
    contract: options.contract,
    role: getRoleHash(options.role),
  });
}
