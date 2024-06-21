import { useQuery } from "@tanstack/react-query";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  type ConnectionManager,
  getLastConnectedChain,
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
import type { AutoConnectProps } from "../connection/types.js";
import { useConnectCore } from "./useConnect.js";
import { useSetActiveWalletConnectionStatusCore } from "./useSetActiveWalletConnectionStatus.js";

export function useAutoConnectCore(
  manager: ConnectionManager,
  storage: AsyncStorage,
  props: AutoConnectProps,
  getInstalledWallets?: () => Wallet[],
) {
  const setConnectionStatus = useSetActiveWalletConnectionStatusCore(manager);
  const { connect } = useConnectCore(manager, {
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
    const [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
      getStoredConnectedWalletIds(storage),
      getStoredActiveWalletId(storage),
    ]);

    // if no wallets were last connected
    if (!lastConnectedWalletIds) {
      return autoConnected;
    }

    const lastConnectedChain = await getLastConnectedChain(storage);

    async function handleWalletConnection(wallet: Wallet) {
      return wallet.autoConnect({
        client: props.client,
        chain: lastConnectedChain ?? undefined,
      });
    }

    const availableWallets = [...wallets, ...(getInstalledWallets?.() ?? [])];
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
    refetchOnWindowFocus: false,
  });

  return query;
}
