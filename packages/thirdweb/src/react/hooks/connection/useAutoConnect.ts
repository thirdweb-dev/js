import { useEffect } from "react";
import { useThirdwebProviderProps } from "../others/useThirdwebProviderProps.js";
import { connectionManager } from "../../connectionManager.js";
import type { WalletConfig } from "../../types/wallets.js";
import {
  useConnect,
  useSetActiveWalletConnectionStatus,
} from "../../providers/wallet-provider.js";

let autoConnectAttempted = false;

/**
 * @internal
 */
export function AutoConnect() {
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  const { connect } = useConnect();

  const { isAutoConnecting } = connectionManager;
  const { wallets } = useThirdwebProviderProps();
  // get the supported wallets from thirdweb provider
  // check the storage for last connected wallets and connect them all
  // check the storage for last active wallet and set it as active
  useEffect(() => {
    if (autoConnectAttempted) {
      return;
    }

    autoConnectAttempted = true;

    const fn = async () => {
      const [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
        connectionManager.getStoredConnectedWalletIds(),
        connectionManager.getStoredActiveWalletId(),
      ]);

      if (!lastConnectedWalletIds) {
        setConnectionStatus("disconnected");
        return;
      }

      // connect the last active wallet first
      const lastActiveWalletConfig = wallets.find(
        (w) => w.metadata.id === lastActiveWalletId,
      );

      const otherWalletConfigs: WalletConfig[] = [];

      wallets.forEach((w) => {
        if (w.metadata.id === lastActiveWalletId) {
          return;
        }
        if (lastConnectedWalletIds.includes(w.metadata.id)) {
          otherWalletConfigs.push(w);
        }
      });

      // connect the active wallet and set it as active
      if (lastActiveWalletConfig) {
        try {
          const wallet = lastActiveWalletConfig.create();
          await wallet.autoConnect();
          connect(wallet);
        } catch (e) {
          setConnectionStatus("disconnected");
        }
      } else {
        setConnectionStatus("disconnected");
      }

      // connect other wallets
      otherWalletConfigs.forEach(async (config) => {
        const wallet = config.create();
        await wallet.autoConnect();
        connectionManager.connectWallet(wallet);
      });
    };

    (async () => {
      isAutoConnecting.setValue(true);
      await fn();
      isAutoConnecting.setValue(false);
    })();
  });

  return null;
}

let noAutoConnectDone = false;

/**
 * @internal
 */
export function NoAutoConnect() {
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  useEffect(() => {
    if (noAutoConnectDone) {
      return;
    }
    noAutoConnectDone = true;
    setConnectionStatus("disconnected");
  });

  return null;
}
