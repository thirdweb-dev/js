import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  getRoleMember,
  isGetRoleMemberSupported,
} from "../__generated__/IPermissionsEnumerable/read/getRoleMember.js";
import {
  getRoleMemberCount,
  isGetRoleMemberCountSupported,
} from "../__generated__/IPermissionsEnumerable/read/getRoleMemberCount.js";
import { getRoleHash, type RoleInput } from "../utils.js";

/**
 * @extension PERMISSIONS
 */
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
      getRoleMember({ contract: options.contract, index: i, role: roleHash }),
    );
  }

  return Promise.all(promises);
}

/**
 * Checks if the `getAllRoleMembers` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllRoleMembers` method is supported.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { isGetAllRoleMembersSupported } from "thirdweb/extensions/permissions";
 *
 * const supported = isGetAllRoleMembersSupported(["0x..."]);
 * ```
 */
export function isGetAllRoleMembersSupported(
  availableSelectors: string[],
): boolean {
  // both need to be supported to get all members
  return (
    isGetRoleMemberSupported(availableSelectors) &&
    isGetRoleMemberCountSupported(availableSelectors)
  );
}
