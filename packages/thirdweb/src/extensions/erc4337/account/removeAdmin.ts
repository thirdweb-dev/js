import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  isSetPermissionsForSignerSupported,
  setPermissionsForSigner,
} from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { defaultPermissionsForAdmin, signPermissionRequest } from "./common.js";

/**
 * @extension ERC4337
 */
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
 * import { sendTransaction } from 'thirdweb';
 *
 * const transaction = removeAdmin({
 *  contract,
 *  account,
 *  adminAddress: '0x...'
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function removeAdmin(
  options: BaseTransactionOptions<RemoveAdminOptions>,
) {
  const { contract, account, adminAddress } = options;
  return setPermissionsForSigner({
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await defaultPermissionsForAdmin({
          action: "remove-admin",
          target: adminAddress,
        }),
      });
      return {
        req,
        signature,
      };
    },
    contract,
  });
}

/**
 * Checks if the `isRemoveAdminSupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isRemoveAdminSupported` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isRemoveAdminSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isRemoveAdminSupported(["0x..."]);
 * ```
 */
export function isRemoveAdminSupported(availableSelectors: string[]) {
  return isSetPermissionsForSignerSupported(availableSelectors);
}
