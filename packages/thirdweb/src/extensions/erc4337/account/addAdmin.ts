import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { defaultPermissionsForAdmin, signPermissionRequest } from "./common.js";

export type AddAdminOptions = {
  /**
   * The admin account that will perform the operation.
   */
  account: Account;
  /**
   * The address to add as an admin.
   */
  adminAddress: string;
};

/**
 * Adds admin permissions for a specified address.
 * @param options - The options for the addAdmin function.
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { addAdmin } from 'thirdweb/extensions/erc4337';
 *
 * const transaction = addAdmin({
 * contract,
 * account,
 * adminAddress: '0x...'
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function addAdmin(options: BaseTransactionOptions<AddAdminOptions>) {
  const { contract, account, adminAddress } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await defaultPermissionsForAdmin({
          target: adminAddress,
          action: "add-admin",
        }),
      });
      return { signature, req };
    },
  });
}
