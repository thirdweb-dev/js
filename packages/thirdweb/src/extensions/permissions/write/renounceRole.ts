import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { renounceRole as generatedRenounceRole } from "../__generated__/IPermissions/write/renounceRole.js";
import { type RoleInput, getRoleHash } from "../utils.js";

export type RenounceRoleParams = {
  role: RoleInput;
  targetAccountAddress: Address;
};

/**
 * Lets the target account renounce the role. (The target account must be the sender of the transaction.)
 *
 * @param options - The options for renouncing the role.
 * @returns A transaction that revokes the role when sent.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { renounceRole } from "thirdweb/extensions/permissions";
 *
 * const result = await renounceRole({
 *  contract,
 *  role: "admin",
 *  targetAccountAddress: "0x1234567890123456789012345678901234567890",
 * });
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>,
) {
  return generatedRenounceRole({
    contract: options.contract,
    role: getRoleHash(options.role),
    account: options.targetAccountAddress,
  });
}
