import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { revokeRole as generatedRevokeRole } from "../__generated__/IPermissions/write/revokeRole.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type RevokeRoleParams = {
  role: RoleInput;
  targetAccountAddress: Address;
};

/**
 * Revokes a role from a target account.
 *
 * @param options - The options for revoking the role.
 * @returns A transaction that revokes the role when sent.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { revokeRole } from "thirdweb/extensions/permissions";
 *
 * const result = await revokeRole({
 *  contract,
 *  role: "admin",
 *  targetAccountAddress: "0x1234567890123456789012345678901234567890",
 * });
 */
export function revokeRole(options: BaseTransactionOptions<RevokeRoleParams>) {
  return generatedRevokeRole({
    contract: options.contract,
    role: getRoleHash(options.role),
    account: options.targetAccountAddress,
  });
}
