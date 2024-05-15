import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getRoleMember } from "../__generated__/IPermissionsEnumerable/read/getRoleMember.js";
import { getRoleMemberCount } from "../__generated__/IPermissionsEnumerable/read/getRoleMemberCount.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type GetAllRoleMembersParams = {
  role: RoleInput;
};

/**
 * Retrieves all members of a specific role.
 *
 * @param options - The options for retrieving role members.
 * @returns A promise that resolves to an array of strings representing the role members.
 * @extension PERMISSIONS
 *
 * @example
 * ```ts
 * import { getAllRoleMembers } from "thirdweb/extensions/permissions";
 *
 * const result = await getAllRoleMembers({
 *  contract,
 *  role: "admin",
 * });
 * ```
 */
export async function getAllRoleMembers(
  options: BaseTransactionOptions<GetAllRoleMembersParams>,
): Promise<string[]> {
  const roleHash = getRoleHash(options.role);

  const count = await getRoleMemberCount({
    contract: options.contract,
    role: roleHash,
  });

  const promises: Promise<string>[] = [];

  for (let i = 0n; i < count; i++) {
    promises.push(
      getRoleMember({ contract: options.contract, role: roleHash, index: i }),
    );
  }

  return Promise.all(promises);
}
