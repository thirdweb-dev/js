import { useEffect } from "react";
import { connectionManager } from "../../connectionManager.js";
import type { WalletConfig } from "../../types/wallets.js";
import {
  useConnect,
  useSetActiveWalletConnectionStatus,
} from "../wallets/wallet-hooks.js";
import {
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import {
  getSavedConnectParamsFromStorage,
  type WithPersonalWalletConnectionOptions,
} from "../../../../wallets/storage/walletStorage.js";
import type { WalletWithPersonalAccount } from "../../../../wallets/interfaces/wallet.js";
import { asyncLocalStorage } from "../../utils/asyncLocalStorage.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";

let autoConnectAttempted = false;

export type AutoConnectProps = {
  /**
   * Array of wallets that your app uses
   * @example
   * ```tsx
   * import { metamaskConfig, coinbaseConfig, walletConnectConfig } from "thirdweb/react";
   *
   * function Example() {
   *  return (
   *    <AutoConnect
   *      client={client}
   *      wallets={[
   *        metamaskConfig(),
   *        coinbaseConfig(),
   *        walletConnectConfig(),
   *      ]}
   *    />
   *  )
   * }
   * ```
   */
  wallets: WalletConfig[];
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;
  /**
   * Metadata of the app that will be passed to connected wallet.
   *
   * Some wallets display this information to the user when they connect to your app.
   *
   *
   * ```ts
   * {
   *   name: "thirdweb powered dApp",
   *   url: "https://thirdweb.com",
   *   description: "thirdweb powered dApp",
   *   logoUrl: "https://thirdweb.com/favicon.ico",
   * };
   * ```
   */
  appMetadata: AppMetadata;

  /**
   * if the autoConnection does not succeed within given timeout in milliseconds, it will be cancelled.
   *
   * By default, the timeout is set to 15000ms (15 seconds).
   *
   * ```tsx
   * <AutoConnect
   *  client={client}
   *  autoConnect={{ timeout: 10000 }}
   *  wallets={wallets}
   *  appMetadata={appMetadata}
   * />
   * ```
   */
  timeout?: number;
};

/**
 * AutoConnect Last connected wallet.
 * Note: If you are using `ConnectButton`, You don't need to use this component as it is already included in `ConnectButton`.
 * @param props - Object of type `AutoConnectProps`. Refer to [`AutoConnectProps`](https://portal.thirdweb.com/references/typescript/v5/AutoConnectProps)
 * @example
 * ```tsx
 * import { AutoConnect } from "@thirdweb/react";
 *
 * const wallets = [
 *  metamaskConfig(),
 *  coinbaseConfig(),
 * ]
 *
 * function Example() {
 *  return <AutoConnect wallets={wallets} client={client} appMetadata={appMetadata} />;
 * }
 * ```
 * @component
 */
export function AutoConnect(props: AutoConnectProps) {
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  const { connect } = useConnect();
  const { isAutoConnecting } = connectionManager;
  const { wallets, client, appMetadata } = props;
  const timeout = props.timeout ?? 15000;
  // get the supported wallets from thirdweb provider
  // check the storage for last connected wallets and connect them all
  // check the storage for last active wallet and set it as active
  useEffect(() => {
    if (autoConnectAttempted) {
      return;
    }

    autoConnectAttempted = true;

    const startAutoConnect = async () => {
      const [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
        getStoredConnectedWalletIds(asyncLocalStorage),
        getStoredActiveWalletId(asyncLocalStorage),
      ]);

      // if no wallets were last connected
      if (!lastConnectedWalletIds) {
        return;
      }

      async function handleWalletConnection(walletConfig: WalletConfig) {
        setConnectionStatus("connecting");

        // if this wallet requires a personal wallet to be connected
        if (walletConfig.personalWalletConfigs) {
          // get saved connection params for this wallet
          const savedParams = await getSavedConnectParamsFromStorage(
            asyncLocalStorage,
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
            appMetadata,
          });

          const account = await personalWallet.autoConnect();

          // create wallet
          const wallet = walletConfig.create({
            client,
            appMetadata,
          }) as WalletWithPersonalAccount;

          // auto connect the wallet using the personal account
          await wallet.autoConnect({
            personalAccount: account,
          });

          return wallet;
        }

        // if this wallet does not require a personal wallet to be connected
        else {
          const wallet = walletConfig.create({
            client,
            appMetadata,
          });
          await wallet.autoConnect();
          return wallet;
        }
      }

      // connect the last active wallet and set it as active
      const activeWalletConfig = wallets.find(
        (w) => w.metadata.id === lastActiveWalletId,
      );

      if (activeWalletConfig) {
        try {
          const wallet = await timeoutPromise(
            handleWalletConnection(activeWalletConfig),
            {
              ms: timeout,
              message:
                "AutoConnect timeout : " + timeout + "ms limit exceeded.",
            },
          );

          if (wallet) {
            connect(wallet);
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
          connectionManager.addConnectedWallet(account);
        }
      });
    };

    (async () => {
      isAutoConnecting.setValue(true);
      startAutoConnect();
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
