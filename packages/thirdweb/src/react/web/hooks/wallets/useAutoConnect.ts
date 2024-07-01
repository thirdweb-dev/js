import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { AutoConnectProps } from "../../../core/hooks/connection/types.js";
import { useAutoConnectCore } from "../../../core/hooks/wallets/useAutoConnect.js";
import { connectionManager } from "../../index.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";

/**
 * Autoconnect the last previously connected wallet.
 *
 * @example
 * ```tsx
 * import { useAutoConnect } from "thirdweb/react";
 *
 * const { data: autoConnected, isLoading } = useAutoConnect({
 *  client,
 *  accountAbstraction,
 *  wallets,
 *  onConnect,
 *  timeout,
 * });
 * ```
 * @walletConnection
 * @param props - The props for auto connect.
 * @returns whether the auto connect was successful.
 */
export function useAutoConnect(props: AutoConnectProps) {
  const wallets = props.wallets || getDefaultWallets(props);
  return useAutoConnectCore(
    connectionManager,
    webLocalStorage,
    {
      ...props,
      wallets,
    },
    () => {
      const specifiedWalletIds = new Set(wallets.map((x) => x.id));

      // pass the wallets that are not already specified but are installed by the user
      const installedWallets = getInstalledWalletProviders()
        .filter((x) => !specifiedWalletIds.has(x.info.rdns))
        .map((x) => createWallet(x.info.rdns));

      return installedWallets;
    },
  );
}
