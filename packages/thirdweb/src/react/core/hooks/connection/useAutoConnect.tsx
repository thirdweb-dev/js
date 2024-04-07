import { useEffect } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
// import {
//   getSavedConnectParamsFromStorage,
//   type WithPersonalWalletConnectionOptions,
// } from "../../../../wallets/storage/walletStorage.js";
import type {
  Wallet,
  // WalletWithPersonalAccount,
} from "../../../../wallets/interfaces/wallet.js";
import {
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import { asyncLocalStorage } from "../../../../wallets/storage/asyncLocalStorage.js";
import { getSavedConnectParamsFromStorage } from "../../../../wallets/storage/walletStorage.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import { connectionManager } from "../../connectionManager.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
// import type { WalletConfig } from "../../types/wallets.js";
import {
  useConnect,
  useSetActiveWalletConnectionStatus,
} from "../wallets/wallet-hooks.js";

let autoConnectAttempted = false;

export type AutoConnectProps = {
  /**
   * Array of wallets that your app uses
   * @example
   * ```tsx
   * import { AutoConnect } from "thirdweb/react";
   * import { createWallet, inAppWallet } from "thirdweb/wallets";
   *
   * const wallets = [
   *   inAppWallet(),
   *   createWallet("io.metamask"),
   *   createWallet("com.coinbase.wallet"),
   *   createWallet("me.rainbow"),
   * ];
   *
   * function Example() {
   *  return (
   *    <AutoConnect
   *      client={client}
   *      wallets={wallets}
   *    />
   *  )
   * }
   * ```
   */
  wallets: Wallet[];

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
   * Metadata of the app that will be passed to connected wallet. Setting this is highly recommended.
   *
   * Some wallets display this information to the user when they connect to your app.
   * @example
   * ```ts
   * {
   *   name: "My App",
   *   url: "https://my-app.com",
   *   description: "some description about your app",
   *   logoUrl: "https://path/to/my-app/logo.svg",
   * };
   * ```
   */
  appMetadata?: AppMetadata;

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

  /**
   * Enable Account abstraction for all wallets. This will connect to the users's smart account based on the connected personal wallet and the given options.
   *
   * If you are connecting to smart wallet using personal wallet - setting this configuration will autoConnect the personal wallet and then connect to the smart wallet.
   *
   * ```tsx
   * <AutoConnect
   *   accountAbstraction={{
   *    factoryAddress: "0x123...",
   *    chain: sepolia,
   *    gasless: true;
   *   }}
   * />
   */
  accountAbstraction?: SmartWalletOptions;
};

/**
 * AutoConnect last connected wallet on page reload or revisit.
 * Note: If you are using `ConnectButton` or `ConnectEmbed` components, You don't need to use this component as it is already included.
 *
 * This is useful if you are manually connecting the wallets using the [`useConnect`](https://portal.thirdweb.com/references/typescript/v5/useConnect) hook and want to auto connect the last connected wallets on page reload or revisit.
 * @param props - Object of type `AutoConnectProps`. Refer to [`AutoConnectProps`](https://portal.thirdweb.com/references/typescript/v5/AutoConnectProps)
 * @example
 * ```tsx
 * import { AutoConnect } from "thirdweb/react";
 * import { createWallet, inAppWallet } from "thirdweb/wallets";
 *
 *
 * // list of wallets that your app uses
 * const wallets = [
 *  inAppWallet(),
 *  createWallet('io.metamask'),
 *  createWallet("me.rainbow"),
 * ]
 *
 * function Example() {
 *  return (
 *    <AutoConnect
 *      wallets={wallets}
 *      client={client}
 *      appMetadata={appMetadata}
 *    />
 *  );
 * }
 * ```
 * @component
 */
export function AutoConnect(props: AutoConnectProps) {
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  const { connect } = useConnect();
  const { isAutoConnecting } = connectionManager;
  const { wallets, accountAbstraction } = props;
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

      async function handleWalletConnection(wallet: Wallet) {
        setConnectionStatus("connecting");
        return wallet.autoConnect({
          client: props.client,
        });
      }

      if (lastActiveWalletId === "smart") {
        if (!accountAbstraction) {
          return;
        }

        const savedParams = await getSavedConnectParamsFromStorage(
          asyncLocalStorage,
          "accountAbstraction",
        );

        const personalWalletId =
          savedParams && "personalWalletId" in savedParams
            ? savedParams.personalWalletId
            : null;

        if (personalWalletId) {
          const personalWallet = wallets.find((w) => w.id === personalWalletId);

          if (personalWallet) {
            try {
              const account = await timeoutPromise(
                handleWalletConnection(personalWallet),
                {
                  ms: timeout,
                  message: `AutoConnect timeout : ${timeout}ms limit exceeded.`,
                },
              );

              const smartWallet = createWallet("smart", accountAbstraction);
              await smartWallet.connect({
                personalAccount: account,
                client: props.client,
              });

              connect(smartWallet);
            } catch (e) {
              console.error("Failed to auto connect personal wallet");
              console.error(e);
              setConnectionStatus("disconnected");
            }
          }
        }
      } else {
        const activeWallet = wallets.find((w) => w.id === lastActiveWalletId);

        if (activeWallet) {
          try {
            await timeoutPromise(handleWalletConnection(activeWallet), {
              ms: timeout,
              message: `AutoConnect timeout : ${timeout}ms limit exceeded.`,
            });

            connect(activeWallet);
          } catch (e) {
            console.error("Failed to auto connect last active wallet");
            console.error(e);
            setConnectionStatus("disconnected");
          }
        } else {
          setConnectionStatus("disconnected");
        }
      }

      // then connect wallets that were last connected but were not set as active
      const otherWallets = wallets.filter(
        (w) =>
          w.id !== lastActiveWalletId && lastConnectedWalletIds.includes(w.id),
      );

      for (const wallet of otherWallets) {
        try {
          await handleWalletConnection(wallet);
          connectionManager.addConnectedWallet(wallet);
        } catch (e) {
          console.error("Failed to auto connect a non-active connected wallet");
          console.error(e);
          setConnectionStatus("disconnected");
        }
      }
    };

    (async () => {
      isAutoConnecting.setValue(true);
      startAutoConnect();
      isAutoConnecting.setValue(false);
    })();
  });

  return <div> </div>;
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
