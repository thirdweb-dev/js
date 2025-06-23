import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { toWei } from "../../../utils/units.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { getPermissionsForSigner } from "../__generated__/IAccountPermissions/read/getPermissionsForSigner.js";
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
    async asyncParams() {
      const { req, signature } = await signPermissionRequest({
        account,
        contract,
        req: await toContractPermissions({
          permissions,
          target: sessionKeyAddress,
        }),
      });
      return { req, signature };
    },
    contract,
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

/**
 * Checks if the session key should be updated.
 * @param currentPermissions - The current permissions of the session key.
 * @param newPermissions - The new permissions to set for the session key.
 * @returns A boolean indicating if the session key should be updated.
 * @extension ERC4337
 * @example
 * ```ts
 * import { shouldUpdateSessionKey } from "thirdweb/extensions/erc4337";
 *
 * const shouldUpdate = await shouldUpdateSessionKey({ accountContract, sessionKeyAddress, newPermissions });
 * ```
 */
export async function shouldUpdateSessionKey(args: {
  accountContract: ThirdwebContract;
  sessionKeyAddress: string;
  newPermissions: AccountPermissions;
}): Promise<boolean> {
  const { accountContract, sessionKeyAddress, newPermissions } = args;

  // check if account is deployed
  const accountDeployed = await isContractDeployed(accountContract);
  if (!accountDeployed) {
    return true;
  }

  // get current permissions
  const currentPermissions = await getPermissionsForSigner({
    contract: accountContract,
    signer: sessionKeyAddress,
  });
  // check end time validity
  if (
    currentPermissions.endTimestamp &&
    currentPermissions.endTimestamp < Math.floor(Date.now() / 1000)
  ) {
    return true;
  }

  // check targets
  if (
    !areSessionKeyContractTargetsEqual(
      currentPermissions.approvedTargets,
      newPermissions.approvedTargets,
    )
  ) {
    return true;
  }

  // check if the new native token limit is greater than the current one
  if (
    toWei(newPermissions.nativeTokenLimitPerTransaction?.toString() ?? "0") >
    currentPermissions.nativeTokenLimitPerTransaction
  ) {
    return true;
  }

  return false;
}

function areSessionKeyContractTargetsEqual(
  currentTargets: readonly string[],
  newTargets: string[] | "*",
): boolean {
  // Handle the case where approvedTargets is "*"
  if (
    newTargets === "*" &&
    currentTargets.length === 1 &&
    currentTargets[0] === ZERO_ADDRESS
  ) {
    return true;
  }
  if (newTargets !== "*") {
    return newTargets
      .map((target) => target.toLowerCase())
      .every((target) =>
        currentTargets.map((t) => t.toLowerCase()).includes(target),
      );
  }
  return false;
}
