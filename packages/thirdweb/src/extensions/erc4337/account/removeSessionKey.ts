import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  isSetPermissionsForSignerSupported,
  setPermissionsForSigner,
} from "../__generated__/IAccountPermissions/write/setPermissionsForSigner.js";
import { signPermissionRequest, toContractPermissions } from "./common.js";

/**
 * @extension ERC4337
 */
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
 * import { sendTransaction } from 'thirdweb';
 *
 * const transaction = removeSessionKey({
 * contract,
 * account,
 * sessionKeyAddress
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export function removeSessionKey(
  options: BaseTransactionOptions<RemoveSessionKeyOptions>,
) {
  const { contract, account, sessionKeyAddress } = options;
  return setPermissionsForSigner({
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await toContractPermissions({
          permissions: {
            approvedTargets: [],
            nativeTokenLimitPerTransaction: 0,
            permissionEndTimestamp: new Date(0),
            permissionStartTimestamp: new Date(0),
          },
          target: sessionKeyAddress,
        }),
      });
      return { req, signature };
    },
    contract,
  });
}

/**
 * Checks if the `isRemoveSessionKeySupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isRemoveSessionKeySupported` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isRemoveSessionKeySupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isRemoveSessionKeySupported(["0x..."]);
 * ```
 */
export function isRemoveSessionKeySupported(availableSelectors: string[]) {
  return isSetPermissionsForSignerSupported(availableSelectors);
}
