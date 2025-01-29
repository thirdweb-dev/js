import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
import { isEcosystemWallet } from "../ecosystem/is-ecosystem-wallet.js";
import { ClientScopedStorage } from "../in-app/core/authentication/client-scoped-storage.js";
import type {
  AuthArgsType,
  AuthStoredTokenWithCookieReturnType,
} from "../in-app/core/authentication/types.js";
import { getUrlToken } from "../in-app/web/lib/get-url-token.js";
import type { Wallet } from "../interfaces/wallet.js";
import {
  type ConnectionManager,
  getLastConnectedChain,
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../manager/index.js";
import type { WalletId } from "../wallet-types.js";
import type { AutoConnectProps } from "./types.js";

/**
 * @internal
 */
export const autoConnectCore = async ({
  storage,
  props,
  createWalletFn,
  manager,
  connectOverride,
  getInstalledWallets,
  setLastAuthProvider,
}: {
  storage: AsyncStorage;
  props: AutoConnectProps & { wallets: Wallet[] };
  createWalletFn: (id: WalletId) => Wallet;
  manager: ConnectionManager;
  connectOverride?: (
    walletOrFn: Wallet | (() => Promise<Wallet>),
  ) => Promise<Wallet | null>;
  getInstalledWallets?: () => Wallet[];
  setLastAuthProvider?: (
    authProvider: AuthArgsType["strategy"],
    storage: AsyncStorage,
  ) => Promise<void>;
}): Promise<boolean> => {
  const { wallets, onConnect } = props;
  const timeout = props.timeout ?? 15000;

  let autoConnected = false;
  manager.isAutoConnecting.setValue(true);

  let [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
    getStoredConnectedWalletIds(storage),
    getStoredActiveWalletId(storage),
  ]);

  const result = getUrlToken();

  // If an auth cookie is found and this site supports the wallet, we'll set the auth cookie in the client storage
  const wallet = wallets.find((w) => w.id === result?.walletId);
  if (result?.authCookie && wallet) {
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
    await clientStorage.saveAuthCookie(result.authCookie);
  }
  if (result?.walletId) {
    lastActiveWalletId = result.walletId;
    lastConnectedWalletIds = lastConnectedWalletIds?.includes(result.walletId)
      ? lastConnectedWalletIds
      : [result.walletId, ...(lastConnectedWalletIds || [])];
  }

  if (result?.authProvider) {
    await setLastAuthProvider?.(result.authProvider, storage);
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
    manager.activeWalletConnectionStatusStore.setValue("connecting"); // only set connecting status if we are connecting the last active EOA
    await timeoutPromise(
      handleWalletConnection({
        wallet: activeWallet,
        client: props.client,
        lastConnectedChain,
        authResult: result?.authResult,
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

    try {
      // connected wallet could be activeWallet or smart wallet
      const connectedWallet = await (connectOverride
        ? connectOverride(activeWallet)
        : manager.connect(activeWallet, {
            client: props.client,
            accountAbstraction: props.accountAbstraction,
          }));
      if (connectedWallet) {
        autoConnected = true;
        try {
          onConnect?.(connectedWallet);
        } catch {
          // ignore
        }
      } else {
        manager.activeWalletConnectionStatusStore.setValue("disconnected");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.warn("Error auto connecting wallet:", e.message);
      }
      manager.activeWalletConnectionStatusStore.setValue("disconnected");
    }
  } else {
    manager.activeWalletConnectionStatusStore.setValue("disconnected");
  }

  // then connect wallets that were last connected but were not set as active
  const otherWallets = availableWallets.filter(
    (w) => w.id !== lastActiveWalletId && lastConnectedWalletIds.includes(w.id),
  );
  for (const wallet of otherWallets) {
    try {
      await handleWalletConnection({
        wallet,
        client: props.client,
        lastConnectedChain,
        authResult: result?.authResult,
      });
      manager.addConnectedWallet(wallet);
    } catch {
      // no-op
    }
  }
  manager.isAutoConnecting.setValue(false);
  return autoConnected; // useQuery needs a return value
};

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
