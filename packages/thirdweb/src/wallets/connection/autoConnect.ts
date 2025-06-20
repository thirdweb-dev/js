import { webLocalStorage } from "../../utils/storage/webStorage.js";
import { createWallet } from "../create-wallet.js";
import { getDefaultWallets } from "../defaultWallets.js";
import { getInstalledWalletProviders } from "../injected/mipdStore.js";
import type { Wallet } from "../interfaces/wallet.js";
import { createConnectionManager } from "../manager/index.js";
import { autoConnectCore } from "./autoConnectCore.js";
import type { AutoConnectProps } from "./types.js";

/**
 * Attempts to automatically connect to the last connected wallet.
 * It combines both specified wallets and installed wallet providers that aren't already specified.
 *
 * @example
 *
 * ```tsx
 * import { autoConnect } from "thirdweb/wallets";
 *
 * const autoConnected = await autoConnect({
 *  client,
 *  onConnect: (wallet) => {
 *    console.log("wallet", wallet);
 *  },
 * });
 * ```
 *
 * @param props - The auto-connect configuration properties
 * @param props.wallets - Array of wallet instances to consider for auto-connection
 * @returns {boolean} a promise resolving to true or false depending on whether the auto connect function connected to a wallet or not
 * @walletConnection
 */
export async function autoConnect(
  props: AutoConnectProps & {
    wallets?: Wallet[];
    /**
     * If true, the auto connect will be forced even if autoConnect has already been attempted successfully earlier.
     *
     * @default `false`
     */
    force?: boolean;
  },
): Promise<boolean> {
  const wallets = props.wallets || getDefaultWallets(props);
  const manager = createConnectionManager(webLocalStorage);
  const result = await autoConnectCore({
    createWalletFn: createWallet,
    getInstalledWallets: () => {
      const specifiedWalletIds = new Set(wallets.map((x) => x.id));

      // pass the wallets that are not already specified but are installed by the user
      const installedWallets = getInstalledWalletProviders()
        .filter((x) => !specifiedWalletIds.has(x.info.rdns))
        .map((x) => createWallet(x.info.rdns));

      return installedWallets;
    },
    manager,
    props: {
      ...props,
      wallets,
    },
    storage: webLocalStorage,
  });
  return result;
}
