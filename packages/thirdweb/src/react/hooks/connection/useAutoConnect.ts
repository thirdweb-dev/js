import { useEffect } from "react";
import { useThirdwebProviderProps } from "../others/useThirdwebProviderProps.js";
import { connectionManager } from "../../connectionManager.js";
import type { WalletConfig } from "../../types/wallets.js";

let autoConnectAttempted = false;

/**
 * An effect that is only runs once on page load that will connect all previously connected wallets and set the last active wallet as active.
 * @example
 * ```ts
 * useAutoConnect();
 * ```
 */
export function useAutoConnect() {
  const { wallets, autoConnect } = useThirdwebProviderProps();
  // get the supported wallets from thirdweb provider
  // check the storage for last connected wallets and connect them all
  // check the storage for last active wallet and set it as active
  useEffect(() => {
    if (autoConnectAttempted || !autoConnect) {
      return;
    }

    autoConnectAttempted = true;

    const fn = async () => {
      const [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
        connectionManager.getStoredConnectedWalletIds(),
        connectionManager.getStoredActiveWalletId(),
      ]);

      if (!lastConnectedWalletIds) {
        return;
      }

      // connect the last active wallet first
      const lastActiveWalletConfig = wallets.find(
        (w) => w.id === lastActiveWalletId,
      );

      const otherWalletConfigs: WalletConfig[] = [];

      wallets.forEach((w) => {
        if (w.id === lastActiveWalletId) {
          return;
        }
        if (lastConnectedWalletIds.includes(w.id)) {
          otherWalletConfigs.push(w);
        }
      });

      // connect the active wallet and set it as active
      lastActiveWalletConfig
        ?.createWallet({
          autoConnect: true,
        })
        .then((w) => {
          connectionManager.connectWallet(w);
          connectionManager.setActiveWalletId(w.id);
        });

      // connect other wallets
      otherWalletConfigs.forEach((config) => {
        config
          .createWallet({
            autoConnect: true,
          })
          .then((w) => {
            connectionManager.connectWallet(w);
          });
      });
    };

    fn();
  });
}
