import type { ThirdwebContract } from "../../../contract/contract.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { removeExtension } from "../__generated__/IExtensionManager/write/removeExtension.js";

export type UninstallExtensionOptions = {
  account: Account;
  contract: ThirdwebContract;
  extensionName: string;
};

/**
 * Uninstall an extension on a dynamic contract
 * @param options - The options for uninstalling an extension
 * @returns A prepared transaction to send
 * @example
 * ```ts
 * import { uninstallExtension } from "thirdweb/dynamic-contracts";
 * const transaction = uninstallExtension({
 *  client,
 *  chain,
 *  account,
 *  contract,
 *  extensionName: "MyExtension",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function uninstallExtension(options: UninstallExtensionOptions) {
  const { contract, extensionName } = options;

  return removeExtension({
    contract,
    extensionName,
  });
}
