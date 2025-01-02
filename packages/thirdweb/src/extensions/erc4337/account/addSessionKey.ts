import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  isSetPermissionsForSignerSupported,
  setPermissionsForSigner,
} from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { signPermissionRequest, toContractPermissions } from "./common.js";
import type { AccountPermissions } from "./types.js";

/**
 * @extension ERC4337
 */
export type AddSessionKeyOptions = {
  /**
   * The admin account that will perform the operation.
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
 * @param {Contract} options.contract - The smart account contract to add the session key to
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { addSessionKey } from 'thirdweb/extensions/erc4337';
 * import { sendTransaction } from 'thirdweb';
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
 *
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

/**
 * Checks if the `isAddSessionKeySupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isAddSessionKeySupported` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAddSessionKeySupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isAddSessionKeySupported(["0x..."]);
 * ```
 */
export function isAddSessionKeySupported(availableSelectors: string[]) {
  return isSetPermissionsForSignerSupported(availableSelectors);
}
