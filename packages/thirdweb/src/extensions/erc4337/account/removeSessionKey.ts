import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { setPermissionsForSigner } from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { signPermissionRequest, toContractPermissions } from "./common.js";

export type RemoveSessionKeyOptions = {
  /**
   * The account that will perform the operation.
   */
  account: Account;
  /**
   * The address to remove as a session key.
   */
  sessionKeyAddress: string;
};

/**
 * Removes session key permissions for a specified address.
 * @param options - The options for the removeSessionKey function.
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { removeSessionKey } from 'thirdweb/extensions/erc4337';
 *
 * const transaction = removeSessionKey({
 * contract,
 * account,
 * sessionKeyAddress
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function removeSessionKey(
  options: BaseTransactionOptions<RemoveSessionKeyOptions>,
) {
  const { contract, account, sessionKeyAddress } = options;
  return setPermissionsForSigner({
    contract,
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await toContractPermissions({
          target: sessionKeyAddress,
          permissions: {
            approvedTargets: [],
            nativeTokenLimitPerTransaction: 0,
            permissionStartTimestamp: new Date(0),
            permissionEndTimestamp: new Date(0),
          },
        }),
      });
      return { signature, req };
    },
  });
}
