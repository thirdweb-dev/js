import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { hasRole as hasRoleGenerated } from "../__generated__/IPermissions/read/hasRole.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type HasRoleParams = {
  role: RoleInput;
  targetAccountAddress: string;
};

/**
 * Checks if the target account has the role.
 *
 * @param options - The options for checking the role.
 * @returns A boolean that is true if the target account has the role.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { hasRole } from "thirdweb/extensions/permissions";
 *
 * const result = await hasRole({
 *  contract,
 *  role: "admin",
 *  targetAccountAddress: "0x1234567890123456789012345678901234567890",
 * });
 */
export function hasRole(
  options: BaseTransactionOptions<HasRoleParams>,
): Promise<boolean> {
  return hasRoleGenerated({
    contract: options.contract,
    role: getRoleHash(options.role),
    account: options.targetAccountAddress,
  });
}
