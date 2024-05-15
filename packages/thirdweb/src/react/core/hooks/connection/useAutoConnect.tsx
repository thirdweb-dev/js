"use client";
import { useEffect } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  getLastConnectedChain,
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import { asyncLocalStorage } from "../../../../wallets/storage/asyncLocalStorage.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import { connectionManager } from "../../connectionManager.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
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

  /**
   * Callback to be called on successful auto-connection of last active wallet. The callback is called with the connected wallet
   *
   * ```tsx
   * <AutoConnect
   *  onConnect={(wallet) => {
   *    console.log("auto connected to", wallet)
   *  }}
   * />
   * ```
   */
  onConnect?: (wallet: Wallet) => void;
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
  const { connect } = useConnect({
    client: props.client,
    accountAbstraction: props.accountAbstraction,
  });
  const { isAutoConnecting } = connectionManager;
  const { wallets, onConnect } = props;
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

      const lastConnectedChain = await getLastConnectedChain(asyncLocalStorage);

      async function handleWalletConnection(wallet: Wallet) {
        return wallet.autoConnect({
          client: props.client,
          chain: lastConnectedChain ?? undefined,
        });
      }

      const activeWallet =
        lastActiveWalletId && wallets.find((w) => w.id === lastActiveWalletId);

      if (activeWallet) {
        try {
          setConnectionStatus("connecting"); // only set connecting status if we are connecting the last active EOA
          await timeoutPromise(handleWalletConnection(activeWallet), {
            ms: timeout,
            message: `AutoConnect timeout : ${timeout}ms limit exceeded.`,
          });

          // connected wallet could be activeWallet or smart wallet
          const connectedWallet = await connect(activeWallet);

          if (connectedWallet) {
            if (onConnect) {
              try {
                onConnect(connectedWallet);
              } catch {
                // ignore
              }
            }
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
          w.id !== lastActiveWalletId && lastConnectedWalletIds.includes(w.id),
      );

      for (const wallet of otherWallets) {
        try {
          await handleWalletConnection(wallet);
          connectionManager.addConnectedWallet(wallet);
        } catch (e) {
          console.error("Failed to auto connect a non-active connected wallet");
          console.error(e);
        }
      }
    };

    (async () => {
      isAutoConnecting.setValue(true);
      await startAutoConnect();
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
