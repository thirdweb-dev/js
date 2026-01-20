import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import { timeoutPromise } from "../../utils/timeoutPromise.js";
import { isEcosystemWallet } from "../ecosystem/is-ecosystem-wallet.js";
import { ClientScopedStorage } from "../in-app/core/authentication/client-scoped-storage.js";
import { linkAccount } from "../in-app/core/authentication/linkAccount.js";
import type {
  AuthArgsType,
  AuthStoredTokenWithCookieReturnType,
} from "../in-app/core/authentication/types.js";
import { isInAppSigner } from "../in-app/core/wallet/is-in-app-signer.js";
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

type AutoConnectCoreProps = {
  storage: AsyncStorage;
  props: AutoConnectProps & { wallets: Wallet[] };
  createWalletFn: (id: WalletId) => Wallet;
  manager: ConnectionManager;
  connectOverride?: (
    walletOrFn: Wallet | (() => Promise<Wallet>),
  ) => Promise<Wallet | null>;
  setLastAuthProvider?: (
    authProvider: AuthArgsType["strategy"],
    storage: AsyncStorage,
  ) => Promise<void>;
  /**
   * If true, the auto connect will be forced even if autoConnect has already been attempted successfully earlier.
   *
   * @default `false`
   */
  force?: boolean;
};

let lastAutoConnectionResultPromise: Promise<boolean> | undefined;

/**
 * @internal
 */
export const autoConnectCore = async (props: AutoConnectCoreProps) => {
  // if an auto connect was attempted already
  if (lastAutoConnectionResultPromise && !props.force) {
    // wait for its resolution
    const lastResult = await lastAutoConnectionResultPromise;
    // if it was successful, return true
    // if not continue with the new auto connect
    if (lastResult) {
      return true;
    }
  }

  const resultPromise = _autoConnectCore(props);
  lastAutoConnectionResultPromise = resultPromise;
  return resultPromise;
};

const _autoConnectCore = async ({
  storage,
  props,
  createWalletFn,
  manager,
  connectOverride,
  setLastAuthProvider,
}: AutoConnectCoreProps): Promise<boolean> => {
  const { wallets, onConnect } = props;
  const timeout = props.timeout ?? 15000;

  let autoConnected = false;
  manager.isAutoConnecting.setValue(true);

  let [lastConnectedWalletIds, lastActiveWalletId] = await Promise.all([
    getStoredConnectedWalletIds(storage),
    getStoredActiveWalletId(storage),
  ]);

  const urlToken = getUrlToken();

  // Handle linking flow: autoconnect with stored credentials, then link the new profile
  if (urlToken?.authFlow === "link" && urlToken.authResult) {
    const linkingResult = await handleLinkingFlow({
      client: props.client,
      connectOverride,
      createWalletFn,
      manager,
      onConnect,
      props,
      setLastAuthProvider,
      storage,
      timeout,
      urlToken,
      wallets,
    });
    return linkingResult;
  }

  // If an auth cookie is found and this site supports the wallet, we'll set the auth cookie in the client storage
  const wallet = wallets.find((w) => w.id === urlToken?.walletId);
  if (urlToken?.authCookie && wallet) {
    const clientStorage = new ClientScopedStorage({
      clientId: props.client.clientId,
      ecosystem: isEcosystemWallet(wallet)
        ? {
            id: wallet.id,
            partnerId: wallet.getConfig()?.partnerId,
          }
        : undefined,
      storage,
    });
    await clientStorage.saveAuthCookie(urlToken.authCookie);
  }
  if (urlToken?.walletId) {
    lastActiveWalletId = urlToken.walletId;
    lastConnectedWalletIds = lastConnectedWalletIds?.includes(urlToken.walletId)
      ? lastConnectedWalletIds
      : [urlToken.walletId, ...(lastConnectedWalletIds || [])];
  }

  if (urlToken?.authProvider) {
    await setLastAuthProvider?.(urlToken.authProvider, storage);
  }

  // if no wallets were last connected or we didn't receive an auth token
  if (!lastConnectedWalletIds) {
    return autoConnected;
  }

  // this flow can actually be used for a first connection in the case of a redirect
  // in that case, we default to the passed chain to connect to
  const lastConnectedChain =
    (await getLastConnectedChain(storage)) || props.chain;
  const availableWallets = lastConnectedWalletIds.map((id) => {
    const specifiedWallet = wallets.find((w) => w.id === id);
    if (specifiedWallet) {
      return specifiedWallet;
    }
    return createWalletFn(id as WalletId);
  });
  const activeWallet =
    lastActiveWalletId &&
    (availableWallets.find((w) => w.id === lastActiveWalletId) ||
      createWalletFn(lastActiveWalletId));

  if (activeWallet) {
    manager.activeWalletConnectionStatusStore.setValue("connecting"); // only set connecting status if we are connecting the last active EOA
    await timeoutPromise(
      handleWalletConnection({
        authResult: urlToken?.authResult,
        client: props.client,
        lastConnectedChain,
        wallet: activeWallet,
      }),
      {
        message: `AutoConnect timeout: ${timeout}ms limit exceeded.`,
        ms: timeout,
      },
    ).catch((err) => {
      console.warn(err.message);
      if (props.onTimeout) {
        props.onTimeout();
      }
    });

    try {
      // connected wallet could be activeWallet or smart wallet
      await (connectOverride
        ? connectOverride(activeWallet)
        : manager.connect(activeWallet, {
            accountAbstraction: props.accountAbstraction,
            client: props.client,
          }));
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
        authResult: urlToken?.authResult,
        client: props.client,
        lastConnectedChain,
        wallet,
      });
      manager.addConnectedWallet(wallet);
    } catch {
      // no-op
    }
  }

  // Auto-login with SIWE
  const isIAW =
    activeWallet &&
    isInAppSigner({
      connectedWallets: activeWallet
        ? [activeWallet, ...otherWallets]
        : otherWallets,
      wallet: activeWallet,
    });
  if (
    isIAW &&
    props.siweAuth?.requiresAuth &&
    !props.siweAuth?.isLoggedIn &&
    !props.siweAuth?.isLoggingIn
  ) {
    await props.siweAuth?.doLogin().catch((err) => {
      console.warn("Error signing in with SIWE:", err.message);
    });
  }
  manager.isAutoConnecting.setValue(false);

  const connectedActiveWallet = manager.activeWalletStore.getValue();
  const allConnectedWallets = manager.connectedWallets.getValue();
  if (connectedActiveWallet) {
    autoConnected = true;
    try {
      onConnect?.(connectedActiveWallet, allConnectedWallets);
    } catch (e) {
      console.error("Error calling onConnect callback:", e);
    }
  } else {
    manager.activeWalletConnectionStatusStore.setValue("disconnected");
  }

  return autoConnected; // useQuery needs a return value
};

/**
 * Handles the linking flow when returning from an OAuth redirect with authFlow=link.
 * This autoconnects using stored credentials, then links the new profile from the URL token.
 * @internal
 */
async function handleLinkingFlow(params: {
  client: ThirdwebClient;
  urlToken: NonNullable<ReturnType<typeof getUrlToken>>;
  wallets: Wallet[];
  storage: AsyncStorage;
  manager: ConnectionManager;
  onConnect?: (wallet: Wallet, connectedWallets: Wallet[]) => void;
  timeout: number;
  connectOverride?: (
    walletOrFn: Wallet | (() => Promise<Wallet>),
  ) => Promise<Wallet | null>;
  createWalletFn: (id: WalletId) => Wallet;
  setLastAuthProvider?: (
    authProvider: AuthArgsType["strategy"],
    storage: AsyncStorage,
  ) => Promise<void>;
  props: AutoConnectProps & { wallets: Wallet[] };
}): Promise<boolean> {
  const {
    client,
    connectOverride,
    createWalletFn,
    manager,
    onConnect,
    props,
    setLastAuthProvider,
    storage,
    timeout,
    urlToken,
    wallets,
  } = params;

  // Get stored wallet credentials (not from URL)
  const [storedConnectedWalletIds, storedActiveWalletId] = await Promise.all([
    getStoredConnectedWalletIds(storage),
    getStoredActiveWalletId(storage),
  ]);
  const lastConnectedChain =
    (await getLastConnectedChain(storage)) || props.chain;

  if (!storedActiveWalletId || !storedConnectedWalletIds) {
    console.warn("No stored wallet found for linking flow");
    manager.isAutoConnecting.setValue(false);
    return false;
  }

  // Update auth provider if provided
  if (urlToken.authProvider) {
    await setLastAuthProvider?.(urlToken.authProvider, storage);
  }

  // Find or create the active wallet from stored credentials
  const activeWallet =
    wallets.find((w) => w.id === storedActiveWalletId) ||
    createWalletFn(storedActiveWalletId);

  // Autoconnect WITHOUT the URL token (use stored credentials)
  manager.activeWalletConnectionStatusStore.setValue("connecting");
  try {
    await timeoutPromise(
      handleWalletConnection({
        authResult: undefined, // Don't use URL token for connection
        client,
        lastConnectedChain,
        wallet: activeWallet,
      }),
      {
        message: `AutoConnect timeout: ${timeout}ms limit exceeded.`,
        ms: timeout,
      },
    );

    await (connectOverride
      ? connectOverride(activeWallet)
      : manager.connect(activeWallet, {
          accountAbstraction: props.accountAbstraction,
          client,
        }));
  } catch (e) {
    console.warn("Failed to auto-connect for linking:", e);
    manager.activeWalletConnectionStatusStore.setValue("disconnected");
    manager.isAutoConnecting.setValue(false);
    return false;
  }

  // Now link the new profile using URL auth token
  const ecosystem = isEcosystemWallet(activeWallet)
    ? {
        id: activeWallet.id,
        partnerId: activeWallet.getConfig()?.partnerId,
      }
    : undefined;

  const clientStorage = new ClientScopedStorage({
    clientId: client.clientId,
    ecosystem,
    storage,
  });

  try {
    await linkAccount({
      client,
      ecosystem,
      storage: clientStorage,
      tokenToLink: urlToken.authResult!.storedToken.cookieString,
    });
  } catch (e) {
    console.error("Failed to link profile after redirect:", e);
    // Continue - user is still connected, just linking failed
  }

  manager.isAutoConnecting.setValue(false);

  const connectedWallet = manager.activeWalletStore.getValue();
  const allConnectedWallets = manager.connectedWallets.getValue();
  if (connectedWallet) {
    try {
      onConnect?.(connectedWallet, allConnectedWallets);
    } catch (e) {
      console.error("Error calling onConnect callback:", e);
    }
    return true;
  }

  return false;
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
    authResult: props.authResult,
    chain: props.lastConnectedChain,
    client: props.client,
  });
}
