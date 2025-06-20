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
 * import { sendTransaction } from 'thirdweb';
 *
 * const transaction = addAdmin({
 * contract,
 * account,
 * adminAddress: '0x...'
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function addAdmin(options: BaseTransactionOptions<AddAdminOptions>) {
  const { contract, account, adminAddress } = options;
  return setPermissionsForSigner({
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await defaultPermissionsForAdmin({
          action: "add-admin",
          target: adminAddress,
        }),
      });
      return { req, signature };
    },
    contract,
  });
}

/**
 * Checks if the `isAddAdminSupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isAddAdminSupported` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAddAdminSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isAddAdminSupported(["0x..."]);
 * ```
 */
export function isAddAdminSupported(availableSelectors: string[]) {
  return isSetPermissionsForSignerSupported(availableSelectors);
}
