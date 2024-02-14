import { useEffect } from "react";
import { useThirdwebProviderProps } from "../others/useThirdwebProviderProps.js";
import { connectionManager } from "../../connectionManager.js";
import type { WalletConfig } from "../../types/wallets.js";
import {
  useConnect,
  useSetActiveWalletConnectionStatus,
} from "../../providers/wallet-provider.js";
import {
  getSavedConnectParamsFromStorage,
  type WalletWithPersonalAccount,
  type WithPersonalWalletConnectionOptions,
} from "../../../wallets/index.js";

let autoConnectAttempted = false;

/**
 * @internal
 */
export function AutoConnect() {
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  const { connect } = useConnect();
  const { isAutoConnecting } = connectionManager;
  const { wallets, client, dappMetadata } = useThirdwebProviderProps();
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

      // if no wallets were last connected
      if (!lastConnectedWalletIds) {
        setConnectionStatus("disconnected");
        return;
      }

      async function handleWalletConnection(walletConfig: WalletConfig) {
        // if this wallet requires a personal wallet to be connected
        if (walletConfig.personalWalletConfigs) {
          // get saved connection params for this wallet
          const savedParams = await getSavedConnectParamsFromStorage(
            walletConfig.metadata.id,
          );

          // if must be an object with `personalWalletId` property
          if (!isValidWithPersonalWalletConnectionOptions(savedParams)) {
            throw new Error("Invalid connection params");
          }

          // find the personal wallet config
          const personalWalletConfig = walletConfig.personalWalletConfigs.find(
            (w) => w.metadata.id === savedParams.personalWalletId,
          );

          if (!personalWalletConfig) {
            throw new Error("Personal wallet not found");
          }

          // create and auto connect the personal wallet to get personal account
          const personalWallet = personalWalletConfig.create({
            client,
            dappMetadata,
          });

          const personalAccount = await personalWallet.autoConnect();

          // create wallet
          const wallet = walletConfig.create({
            client,
            dappMetadata,
          }) as WalletWithPersonalAccount;

          // auto connect the wallet using the personal account
          const account = await wallet.autoConnect({
            personalAccount,
          });

          return account;
        }

        // if this wallet does not require a personal wallet to be connected
        else {
          const wallet = walletConfig.create({
            client,
            dappMetadata,
          });
          const account = await wallet.autoConnect();
          return account;
        }
      }

      // connect the last active wallet and set it as active
      const activeWalletConfig = wallets.find(
        (w) => w.metadata.id === lastActiveWalletId,
      );

      if (activeWalletConfig) {
        try {
          const account = await handleWalletConnection(activeWalletConfig);
          if (account) {
            connect(account);
          } else {
            setConnectionStatus("disconnected");
          }
        } catch (e) {
          console.error("Failed to auto connect last active wallet");
          console.error(e);
          setConnectionStatus("disconnected");
        }
      } else {
        setConnectionStatus("disconnected");
      }

      // then connect wallets that were last connected but were not set as active
      const otherWallets = wallets.filter(
        (w) =>
          w.metadata.id !== lastActiveWalletId &&
          lastConnectedWalletIds.includes(w.metadata.id),
      );

      otherWallets.forEach(async (config) => {
        const account = await handleWalletConnection(config);
        if (account) {
          connectionManager.setConnectedAccount(account);
        }
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

function isValidWithPersonalWalletConnectionOptions(
  options: any,
): options is WithPersonalWalletConnectionOptions {
  return (
    typeof options === "object" &&
    options !== null &&
    typeof options.personalWalletId === "string"
  );
}
