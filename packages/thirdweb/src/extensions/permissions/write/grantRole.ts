import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { grantRole as generatedGrantRole } from "../__generated__/IPermissions/write/grantRole.js";
import { getRoleHash, type RoleInput } from "../utils.js";

export { isGrantRoleSupported } from "../__generated__/IPermissions/write/grantRole.js";

/**
 * @extension PERMISSIONS
 */
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
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = grantRole({
 *  contract,
 *  role: "admin",
 *  targetAccountAddress: "0x1234567890123456789012345678901234567890",
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function grantRole(options: BaseTransactionOptions<GrantRoleParams>) {
  return generatedGrantRole({
    account: options.targetAccountAddress,
    contract: options.contract,
    role: getRoleHash(options.role),
  });
}
