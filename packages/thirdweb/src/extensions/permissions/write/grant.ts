import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { grantRole as generatedGrantRole } from "../__generated__/IPermissions/write/grantRole.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type GrantRoleParams = {
  role: RoleInput;
  targetAccountAddress: Address;
};

/**
 * Grants a role to a target account.
 *
 * @param options - The options for granting the role.
 * @returns A transaction that grants the role when sent.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { grantRole } from "thirdweb/extensions/permissions";
 *
 * const result = await grantRole({
 *  contract,
 *  role: "admin",
 *  targetAccountAddress: "0x1234567890123456789012345678901234567890",
 * });
 */
export function grantRole(options: BaseTransactionOptions<GrantRoleParams>) {
  return generatedGrantRole({
    contract: options.contract,
    role: getRoleHash(options.role),
    account: options.targetAccountAddress,
  });
}
