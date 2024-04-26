import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { defaultPermissionsForAdmin, signPermissionRequest } from "./common.js";

export type RemoveAdminOptions = {
  /**
   * The admin account that will perform the operation.
   */
  account: Account;
  /**
   * The address to remove as an admin.
   */
  adminAddress: string;
};

/**
 * Removes admin permissions for a specified address.
 * @param options - The options for the removeAdmin function.
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { removeAdmin } from 'thirdweb/extensions/erc4337';
 *
 * const transaction = removeAdmin({
 *  contract,
 *  account,
 *  adminAddress: '0x...'
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function removeAdmin(
  options: BaseTransactionOptions<RemoveAdminOptions>,
) {
  const { contract, account, adminAddress } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await defaultPermissionsForAdmin({
          target: adminAddress,
          action: "remove-admin",
        }),
      });
      return {
        signature,
        req,
      };
    },
  });
}
