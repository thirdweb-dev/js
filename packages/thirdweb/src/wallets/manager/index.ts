import type { Chain } from "../../chains/types.js";
import { defineChain } from "../../chains/utils.js";
import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";
import { createStore } from "../../reactive/store.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import type { AsyncStorage } from "../storage/AsyncStorage.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";

type WalletIdToConnectedWalletMap = Map<string, Wallet>;
export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "unknown";

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";
const ACTIVE_WALLET_ID = "thirdweb:active-wallet-id";

export type ConnectionManager = ReturnType<typeof createConnectionManager>;

/**
 * Create a connection manager for Wallet connections
 * @param storage - An instance of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage)
 * @example
 * ```ts
 * const manager = createConnectionManager();
 * ```
 * @returns A connection manager object
 */
export function createConnectionManager(storage: AsyncStorage) {
  // stores

  // active wallet/account
  const activeWalletStore = createStore<Wallet | undefined>(undefined);
  const activeAccountStore = createStore<Account | undefined>(undefined);
  const activeWalletChainStore = createStore<Chain | undefined>(undefined);
  const activeWalletConnectionStatusStore =
    createStore<ConnectionStatus>("unknown");

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
    newValue.set(wallet.metadata.id, wallet);
    walletIdToConnectedWalletMap.setValue(newValue);
  };

  const removeConnectedWallet = (wallet: Wallet) => {
    const oldValue = walletIdToConnectedWalletMap.getValue();
    const newValue = new Map(oldValue);
    newValue.delete(wallet.metadata.id);
    walletIdToConnectedWalletMap.setValue(newValue);
  };

  const onWalletDisconnect = (wallet: Wallet) => {
    const currentMap = walletIdToConnectedWalletMap.getValue();
    const newMap = new Map(currentMap);
    newMap.delete(wallet.metadata.id);

    walletIdToConnectedWalletMap.setValue(newMap);

    // if disconnecting the active wallet
    if (activeWalletStore.getValue() === wallet) {
      activeWalletStore.setValue(undefined);
      activeAccountStore.setValue(undefined);
      activeWalletChainStore.setValue(undefined);
      activeWalletConnectionStatusStore.setValue("disconnected");
    }
  };

  const disconnectWallet = (wallet: Wallet) => {
    onWalletDisconnect(wallet);
    wallet.disconnect();
  };

  const setActiveWallet = (wallet: Wallet) => {
    const account = wallet.getAccount();
    if (!account) {
      throw new Error("Can not a wallet without an account as active");
    }

    // also add it to connected wallets if it's not already there
    const _connectedWalletsMap = walletIdToConnectedWalletMap.getValue();
    if (!_connectedWalletsMap.has(wallet.metadata.id)) {
      addConnectedWallet(wallet);
    }

    // update active states
    activeWalletStore.setValue(wallet);
    activeAccountStore.setValue(account);
    activeWalletChainStore.setValue(wallet.getChain());
    activeWalletConnectionStatusStore.setValue("connected");

    // setup listeners
    if (wallet.events) {
      const onAccountsChanged = (addresses: string[]) => {
        const newAddress = addresses[0];
        if (!newAddress) {
          onWalletDisconnect(wallet);
          return;
        } else {
          // TODO: get this new object as argument from onAccountsChanged
          // this requires emitting events from the wallet
          const newAccount: Account = {
            ...account,
            address: newAddress,
          };

          activeAccountStore.setValue(newAccount);
        }
      };

      const onChainChanged = (newChainId: string) => {
        const chainId = normalizeChainId(newChainId);
        activeWalletChainStore.setValue(defineChain(chainId));
      };

      const handleDisconnect = () => {
        onWalletDisconnect(wallet);
        if (wallet.events) {
          wallet.events.removeListener("accountsChanged", onAccountsChanged);
          wallet.events.removeListener("chainChanged", onChainChanged);
          wallet.events.removeListener("disconnect", handleDisconnect);
        }
      };

      if (wallet.events) {
        wallet.events.addListener("accountsChanged", onAccountsChanged);
        wallet.events.addListener("chainChanged", onChainChanged);
        wallet.events.addListener("disconnect", handleDisconnect);
      }
    }
  };

  // side effects

  // save last connected wallet ids to storage
  effect(
    () => {
      const accounts = connectedWallets.getValue();
      const ids = accounts
        .map((acc) => acc?.metadata.id)
        .filter((c) => !!c) as string[];

      storage.setItem(CONNECTED_WALLET_IDS, JSON.stringify(ids));
    },
    [connectedWallets],
    false,
  );

  // save active wallet id to storage
  effect(
    () => {
      const value = activeWalletStore.getValue()?.metadata.id;
      if (value) {
        storage.setItem(ACTIVE_WALLET_ID, value);
      } else {
        storage.removeItem(ACTIVE_WALLET_ID);
      }
    },
    [activeWalletStore],
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
