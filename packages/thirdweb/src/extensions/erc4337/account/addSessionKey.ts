import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { signPermissionRequest, toContractPermissions } from "./common.js";
import type { AccountPermissions } from "./types.js";

export type AddSessionKeyOptions = {
  /**
   * The adming account that will perform the operation.
   */
  account: Account;
  /**
   * The address to add as a session key.
   */
  sessionKeyAddress: string;
  /**
   * The permissions to assign to the session key.
   */
  permissions: AccountPermissions;
};

/**
 * Adds session key permissions for a specified address.
 * @param options - The options for the removeSessionKey function.
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { addSessionKey } from 'thirdweb/extensions/erc4337';
 *
 * const transaction = addSessionKey({
 * contract,
 * account,
 * sessionKeyAddress,
 * permissions: {
 *  approvedTargets: ['0x...'],
 *  nativeTokenLimitPerTransaction: 0.1, // in ETH
 *  permissionStartTimestamp: new Date(),
 *  permissionEndTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year from now
 * }
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function addSessionKey(
  options: BaseTransactionOptions<AddSessionKeyOptions>,
) {
  const { contract, sessionKeyAddress, account, permissions } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await toContractPermissions({
          target: sessionKeyAddress,
          permissions,
        }),
      });
      return { signature, req };
    },
  });
}
