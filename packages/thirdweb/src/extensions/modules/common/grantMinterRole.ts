import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { grantRoles } from "../__generated__/OwnableRoles/write/grantRoles.js";

const MINTER_ROLE = 1n;

export type GrantMinterRoleParams = {
  user: AbiParameterToPrimitiveType<{
    name: "user";
    type: "address";
    internalType: "address";
  }>;
};

/**
 * Grants the minter role to a user.
 * @param options - The transaction options.
 * @returns The transaction to send.
 * @modules
 *
 * @example
 * ```ts
 * import { grantMinterRole } from "thirdweb/modules";
 *
 * const tx = await grantMinterRole({
 *   contract,
 *   user: userAddress,
 * });
 * ```
 */
export function grantMinterRole(
  options: BaseTransactionOptions<GrantMinterRoleParams>,
) {
  return grantRoles({
    contract: options.contract,
    roles: MINTER_ROLE,
    user: options.user,
  });
}
