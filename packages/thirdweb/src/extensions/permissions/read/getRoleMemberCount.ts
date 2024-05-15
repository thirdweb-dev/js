import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getRoleMemberCount as generatedGetRoleMemberCount } from "../__generated__/IPermissionsEnumerable/read/getRoleMemberCount.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type GetRoleMemberCountParams = {
  role: RoleInput;
};

/**
 * Retrieves the number of members of a specific role.
 *
 * @param options - The options for retrieving role member count.
 * @returns A promise that resolves to the number of members of the role.
 * @extension PERMISSIONS
 *
 * @example
 * ```ts
 * import { getRoleMemberCount } from "thirdweb/extensions/permissions";
 *
 * const result = await getRoleMemberCount({
 *  contract,
 *  role: "admin",
 * });
 * ```
 */
export function getRoleMemberCount(
  options: BaseTransactionOptions<GetRoleMemberCountParams>,
): Promise<bigint> {
  return generatedGetRoleMemberCount({
    contract: options.contract,
    role: getRoleHash(options.role),
  });
}
