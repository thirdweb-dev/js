import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getRoleMember as generatedGetRoleMember } from "../__generated__/IPermissionsEnumerable/read/getRoleMember.js";
import { getRoleHash, type RoleInput } from "../utils.js";

export { isGetRoleMemberSupported } from "../__generated__/IPermissionsEnumerable/read/getRoleMember.js";

/**
 * @extension PERMISSIONS
 */
export type GetRoleMemberParams = {
  role: RoleInput;
  index: bigint;
};

/**
 * Retrieves a specific member of a specific role.
 *
 * @param options - The options for retrieving the role member.
 * @returns A promise that resolves to the address of the role member.
 * @extension PERMISSIONS
 *
 * @example
 * ```ts
 * import { getRoleMember } from "thirdweb/extensions/permissions";
 *
 * const address = await getRoleMember({
 *  contract,
 *  role: "admin",
 *  index: 0n,
 * });
 * ```
 */
export function getRoleMember(
  options: BaseTransactionOptions<GetRoleMemberParams>,
): Promise<string> {
  return generatedGetRoleMember({
    contract: options.contract,
    index: options.index,
    role: getRoleHash(options.role),
  });
}
