"use client";

import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { ClientScopedStorage } from "../../../../wallets/in-app/core/authentication/client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../../../wallets/in-app/core/authentication/types.js";
import { getUrlToken } from "../../../../wallets/in-app/web/lib/get-url-token.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import {
  getLastConnectedChain,
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../../../../wallets/manager/index.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";
import { setLastAuthProvider } from "../../utils/storage.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
import type { AutoConnectProps } from "../connection/types.js";
import { useConnect } from "./useConnect.js";
import { useSetActiveWalletConnectionStatus } from "./useSetActiveWalletConnectionStatus.js";

export function useAutoConnectCore(
  storage: AsyncStorage,
  props: AutoConnectProps & { wallets: Wallet[] },
  createWalletFn: (id: WalletId) => Wallet,
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

    const { authResult, walletId, authProvider, authCookie } = getUrlToken();
    const wallet = wallets.find((w) => w.id === walletId);

    // If an auth cookie is found and this site supports the wallet, we'll set the auth cookie in the client storage
    if (authCookie && wallet) {
      const clientStorage = new ClientScopedStorage({
        storage,
        clientId: props.client.clientId,
        ecosystem: isEcosystemWallet(wallet)
          ? {
              id: wallet.id,
              partnerId: wallet.getConfig()?.partnerId,
            }
          : undefined,
      });
      await clientStorage.saveAuthCookie(authCookie);
    }

    if (walletId) {
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

    // this flow can actually be used for a first connection in the case of a redirect
    // in that case, we default to the passed chain to connect to
    const lastConnectedChain =
      (await getLastConnectedChain(storage)) || props.chain;

    const availableWallets = [...wallets, ...(getInstalledWallets?.() ?? [])];
    const activeWallet =
      lastActiveWalletId &&
      (availableWallets.find((w) => w.id === lastActiveWalletId) ||
        createWalletFn(lastActiveWalletId));

    if (activeWallet) {
      try {
        setConnectionStatus("connecting"); // only set connecting status if we are connecting the last active EOA
        await timeoutPromise(
          handleWalletConnection({
            wallet: activeWallet,
            client: props.client,
            lastConnectedChain,
            authResult,
          }),
          {
            ms: timeout,
            message: `AutoConnect timeout: ${timeout}ms limit exceeded.`,
          },
        ).catch((err) => {
          console.warn(err.message);
          if (props.onTimeout) {
            props.onTimeout();
          }
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
        if (e instanceof Error) {
          console.warn("Error auto connecting wallet:", e.message);
        }
        setConnectionStatus("disconnected");
      }
    } else {
      setConnectionStatus("disconnected");
    }

    // then connect wallets that were last connected but were not set as active
    const otherWallets = availableWallets.filter(
      (w) =>
        w.id !== lastActiveWalletId && lastConnectedWalletIds.includes(w.id),
    );

    for (const wallet of otherWallets) {
      try {
        await handleWalletConnection({
          wallet,
          client: props.client,
          lastConnectedChain,
          authResult,
        });
        manager.addConnectedWallet(wallet);
      } catch {
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

/**
 * @internal
 */
export async function handleWalletConnection(props: {
  wallet: Wallet;
  client: ThirdwebClient;
  authResult: AuthStoredTokenWithCookieReturnType | undefined;
  lastConnectedChain: Chain | undefined;
}) {
  return props.wallet.autoConnect({
    client: props.client,
    chain: props.lastConnectedChain,
    authResult: props.authResult,
  });
}
