import { useQuery } from "@tanstack/react-query";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { getUrlToken } from "../../../../wallets/in-app/web/lib/get-url-token.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  getLastConnectedChain,
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";
import { setLastAuthProvider } from "../../utils/storage.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
import type { AutoConnectProps } from "../connection/types.js";
import { useConnect } from "./useConnect.js";
import { useSetActiveWalletConnectionStatus } from "./useSetActiveWalletConnectionStatus.js";

export function useAutoConnectCore(
  storage: AsyncStorage,
  props: AutoConnectProps & { wallets: Wallet[] },
  getInstalledWallets?: () => Wallet[],
) {
  const manager = useConnectionManagerCtx("useAutoConnect");
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  const { connect } = useConnect({
    client: props.client,
    accountAbstraction: props.accountAbstraction,
  });
  const { isAutoConnecting } = manager;
  const { wallets, onConnect } = props;
  const timeout = props.timeout ?? 15000;
  // get the supported wallets from thirdweb provider
  // check the storage for last connected wallets and connect them all
  // check the storage for last active wallet and set it as active
  const autoConnect = async (): Promise<boolean> => {
    let autoConnected = false;
    isAutoConnecting.setValue(true);
    let [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
      getStoredConnectedWalletIds(storage),
      getStoredActiveWalletId(storage),
    ]);

    const { authResult, walletId, authProvider } = getUrlToken();
    if (authResult && walletId) {
      lastActiveWalletId = walletId;
      lastConnectedWalletIds = lastConnectedWalletIds?.includes(walletId)
        ? lastConnectedWalletIds
        : [walletId, ...(lastConnectedWalletIds || [])];
    }
    if (authProvider) {
      await setLastAuthProvider(authProvider, storage);
    }

    // if no wallets were last connected or we didn't receive an auth token
    if (!lastConnectedWalletIds) {
      return autoConnected;
    }

    const lastConnectedChain = await getLastConnectedChain(storage);

    async function handleWalletConnection(wallet: Wallet) {
      return wallet.autoConnect({
        client: props.client,
        chain: lastConnectedChain ?? undefined,
        authResult,
      });
    }

    const availableWallets = [...wallets, ...(getInstalledWallets?.() ?? [])];
    const activeWallet =
      lastActiveWalletId &&
      (availableWallets.find((w) => w.id === lastActiveWalletId) ||
        createWallet(lastActiveWalletId));

    if (activeWallet) {
      try {
        setConnectionStatus("connecting"); // only set connecting status if we are connecting the last active EOA
        await timeoutPromise(handleWalletConnection(activeWallet), {
          ms: timeout,
          message: `AutoConnect timeout: ${timeout}ms limit exceeded.`,
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
        manager.addConnectedWallet(wallet);
      } catch (e) {
        // no-op
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
    refetchOnWindowFocus: false,
  });

  return query;
}
