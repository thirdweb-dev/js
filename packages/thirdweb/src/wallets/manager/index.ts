import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";
import { createStore } from "../../reactive/store.js";
import { smartWallet } from "../create-wallet.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import type { SmartWalletOptions } from "../smart/types.js";
import type { AsyncStorage } from "../storage/AsyncStorage.js";
import { deleteConnectParamsFromStorage } from "../storage/walletStorage.js";

type WalletIdToConnectedWalletMap = Map<string, Wallet>;
export type ConnectionStatus = "connected" | "disconnected" | "connecting";

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";
const ACTIVE_WALLET_ID = "thirdweb:active-wallet-id";
const LAST_ACTIVE_CHAIN = "thirdweb:active-chain";

export type ConnectionManager = ReturnType<typeof createConnectionManager>;
export type ConnectManagerOptions = {
  client: ThirdwebClient;
  accountAbstraction?: SmartWalletOptions;
};

/**
 * Create a connection manager for Wallet connections
 * @param storage - An instance of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage)
 * @example
 * ```ts
 * const manager = createConnectionManager();
 * ```
 * @returns A connection manager object
 * @walletUtils
 */
export function createConnectionManager(storage: AsyncStorage) {
  // stores

  // active wallet/account
  const activeWalletStore = createStore<Wallet | undefined>(undefined);
  const activeAccountStore = createStore<Account | undefined>(undefined);
  const activeWalletChainStore = createStore<Chain | undefined>(undefined);
  const activeWalletConnectionStatusStore =
    createStore<ConnectionStatus>("disconnected");

  // other connected accounts
  const walletIdToConnectedWalletMap =
    createStore<WalletIdToConnectedWalletMap>(new Map());

  const isAutoConnecting = createStore(false);

  const connectedWallets = computedStore(() => {
    return Array.from(walletIdToConnectedWalletMap.getValue().values());
  }, [walletIdToConnectedWalletMap]);

  // actions
  const addConnectedWallet = (wallet: Wallet) => {
    const oldValue = walletIdToConnectedWalletMap.getValue();
    const newValue = new Map(oldValue);
    newValue.set(wallet.id, wallet);
    walletIdToConnectedWalletMap.setValue(newValue);
  };

  const removeConnectedWallet = (wallet: Wallet) => {
    const oldValue = walletIdToConnectedWalletMap.getValue();
    const newValue = new Map(oldValue);
    newValue.delete(wallet.id);
    walletIdToConnectedWalletMap.setValue(newValue);
  };

  const onWalletDisconnect = (wallet: Wallet) => {
    const currentMap = walletIdToConnectedWalletMap.getValue();
    deleteConnectParamsFromStorage(storage, wallet.id);

    const newMap = new Map(currentMap);
    newMap.delete(wallet.id);

    walletIdToConnectedWalletMap.setValue(newMap);

    // if disconnecting the active wallet
    if (activeWalletStore.getValue() === wallet) {
      storage.removeItem(ACTIVE_WALLET_ID);
      activeAccountStore.setValue(undefined);
      activeWalletChainStore.setValue(undefined);
      activeWalletConnectionStatusStore.setValue("disconnected");
    }
  };

  const disconnectWallet = (wallet: Wallet) => {
    onWalletDisconnect(wallet);
    wallet.disconnect();
  };

  const setActiveWallet = async (
    wallet: Wallet,
    options?: ConnectManagerOptions,
  ) => {
    const personalWallet = wallet;
    let activeWallet = personalWallet;
    if (options?.accountAbstraction) {
      activeWallet = smartWallet(options.accountAbstraction);
      await activeWallet.connect({
        personalAccount: wallet.getAccount(),
        client: options.client,
      });
    }

    const account = activeWallet.getAccount();
    if (!account) {
      throw new Error("Can not set a wallet without an account as active");
    }

    // also add it to connected wallets if it's not already there
    const _connectedWalletsMap = walletIdToConnectedWalletMap.getValue();
    if (!_connectedWalletsMap.has(activeWallet.id)) {
      addConnectedWallet(activeWallet);
    }

    // update active states
    activeWalletStore.setValue(activeWallet);
    activeAccountStore.setValue(account);
    activeWalletChainStore.setValue(activeWallet.getChain());
    activeWalletConnectionStatusStore.setValue("connected");

    // persist last connected personal wallet
    storage.setItem(ACTIVE_WALLET_ID, personalWallet.id);

    // setup listeners

    const onAccountsChanged = (newAccount: Account) => {
      activeAccountStore.setValue(newAccount);
    };

    const unsubAccounts = wallet.subscribe("accountChanged", onAccountsChanged);

    const unsubChainChanged = wallet.subscribe("chainChanged", (chain) =>
      activeWalletChainStore.setValue(chain),
    );
    const unsubDisconnect = wallet.subscribe("disconnect", () => {
      handleDisconnect();
    });

    const handleDisconnect = () => {
      onWalletDisconnect(wallet);

      unsubAccounts();
      unsubChainChanged();
      unsubDisconnect();
    };
  };

  // side effects

  effect(
    () => {
      const _chain = activeWalletChainStore.getValue();
      if (_chain) {
        storage.setItem(LAST_ACTIVE_CHAIN, JSON.stringify(_chain));
      } else {
        storage.removeItem(LAST_ACTIVE_CHAIN);
      }
    },
    [activeWalletChainStore],
    false,
  );

  // save last connected wallet ids to storage
  effect(
    () => {
      const accounts = connectedWallets.getValue();
      const ids = accounts.map((acc) => acc?.id).filter((c) => !!c) as string[];

      storage.setItem(CONNECTED_WALLET_IDS, JSON.stringify(ids));
    },
    [connectedWallets],
    false,
  );

  const switchActiveWalletChain = async (chain: Chain) => {
    const wallet = activeWalletStore.getValue();
    if (!wallet) {
      throw new Error("no wallet found");
    }

    if (!wallet.switchChain) {
      throw new Error("wallet does not support switching chains");
    }

    await wallet.switchChain(chain);
    // for wallets that dont implement events, just set it manually
    activeWalletChainStore.setValue(wallet.getChain());
  };

  return {
    // account
    activeWalletStore: activeWalletStore,
    activeAccountStore: activeAccountStore,
    connectedWallets,
    addConnectedWallet,
    disconnectWallet,
    setActiveWallet,
    activeWalletChainStore: activeWalletChainStore,
    switchActiveWalletChain,
    activeWalletConnectionStatusStore: activeWalletConnectionStatusStore,
    isAutoConnecting,
    removeConnectedWallet,
  };
}

/**
 *
 * @internal
 */
export async function getStoredConnectedWalletIds(
  storage: AsyncStorage,
): Promise<string[] | null> {
  try {
    const value = await storage.getItem(CONNECTED_WALLET_IDS);
    if (value) {
      return JSON.parse(value) as string[];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * @internal
 */
export async function getStoredActiveWalletId(
  storage: AsyncStorage,
): Promise<string | null> {
  try {
    const value = await storage.getItem(ACTIVE_WALLET_ID);
    if (value) {
      return value;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * @internal
 */
export async function getLastConnectedChain(
  storage: AsyncStorage,
): Promise<Chain | null> {
  try {
    const value = await storage.getItem(LAST_ACTIVE_CHAIN);
    if (value) {
      return JSON.parse(value) as Chain;
    }

    return null;
  } catch {
    return null;
  }
}
