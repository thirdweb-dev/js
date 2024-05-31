import { useQuery } from "@tanstack/react-query";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { getInstalledWalletProviders } from "../../../../wallets/injected/mipdStore.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  getLastConnectedChain,
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import { connectionManager } from "../../connectionManager.js";
import { getStorage } from "../../storage.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
import {
  useConnect,
  useSetActiveWalletConnectionStatus,
} from "../wallets/wallet-hooks.js";
import type { AutoConnectProps } from "./AutoConnect.js";

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
  const autoConnect = async (): Promise<boolean> => {
    let autoConnected = false;
    isAutoConnecting.setValue(true);
    const asyncLocalStorage = getStorage();
    const [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
      getStoredConnectedWalletIds(asyncLocalStorage),
      getStoredActiveWalletId(asyncLocalStorage),
    ]);

    // if no wallets were last connected
    if (!lastConnectedWalletIds) {
      return autoConnected;
    }

    const lastConnectedChain = await getLastConnectedChain(asyncLocalStorage);

    async function handleWalletConnection(wallet: Wallet) {
      return wallet.autoConnect({
        client: props.client,
        chain: lastConnectedChain ?? undefined,
      });
    }

    const availableWallets = [
      ...wallets,
      ...getInstalledWalletProviders().map((p) => createWallet(p.info.rdns)),
    ];
    const activeWallet =
      lastActiveWalletId &&
      availableWallets.find((w) => w.id === lastActiveWalletId);

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
              autoConnected = true;
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
    isAutoConnecting.setValue(false);
    return autoConnected; // useQuery needs a return value
  };

  // trigger the auto connect on first mount only
  const query = useQuery({
    queryKey: ["autoConnect", props.client.clientId],
    queryFn: autoConnect,
    refetchOnMount: false,
  });

  return query;
}
