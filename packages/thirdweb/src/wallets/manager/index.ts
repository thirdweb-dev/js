import { createStore } from "../../reactive/store.js";
import type { Wallet } from "../index.js";
import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";

export type ConnectedWalletsMap = Map<string, Wallet>;

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";
const ACTIVE_WALLET_ID = "thirdweb:active-wallet-id";

export type ConnectionManagerOptions = {
  storage: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    remove: (key: string) => Promise<void>;
  };
};

/**
 * Create a connection manager for Wallet connections
 * @param options - The options for creating the connection manager
 * @example
 * ```ts
 * const manager = createConnectionManager();
 * ```
 * @returns A connection manager object
 */
export function createConnectionManager(options: ConnectionManagerOptions) {
  const { storage } = options;
  // stores
  const activeWalletId = createStore<string | undefined>(undefined);
  const activeWalletAddress = createStore<string | undefined>(undefined);
  const activeWalletChainId = createStore<bigint | undefined>(undefined);
  const connectedWalletsMap = createStore<ConnectedWalletsMap>(new Map());

  // computed stores
  const activeWallet = computedStore(() => {
    const id = activeWalletId.getValue();
    const record = connectedWalletsMap.getValue();
    return record.get(id || "");
  }, [activeWalletId, connectedWalletsMap]);

  const connectedWallets = computedStore(() => {
    const value = Array.from(connectedWalletsMap.getValue().values());
    return value;
  }, [connectedWalletsMap]);

  // actions
  const connectWallet = (wallet: Wallet) => {
    const currentMap = connectedWalletsMap.getValue();
    const newMap = new Map(currentMap);
    newMap.set(wallet.id, wallet);
    connectedWalletsMap.setValue(newMap);
  };

  const onDisconnect = (walletId: string) => {
    const currentMap = connectedWalletsMap.getValue();
    const newMap = new Map(currentMap);
    newMap.delete(walletId);
    connectedWalletsMap.setValue(newMap);

    // if it is the active wallet, set active wallet to null
    if (activeWalletId.getValue() === walletId) {
      activeWalletId.setValue(undefined);
    }

    activeWalletAddress.setValue(undefined);
    activeWalletChainId.setValue(undefined);
  };

  const disconnectWallet = (walletId: string) => {
    onDisconnect(walletId);
  };

  const setActiveWalletId = (walletId: string | undefined) => {
    activeWalletId.setValue(walletId);
    const wallet = connectedWalletsMap.getValue().get(walletId || "");

    if (wallet) {
      activeWalletAddress.setValue(wallet.address);
      activeWalletChainId.setValue(wallet.chainId);

      // setup listeners
      if (wallet.addListener) {
        const onAccountsChanged = () => {
          if (wallet.address) {
            activeWalletAddress.setValue(wallet.address);
          } else {
            onDisconnect(wallet.id);
          }
        };

        const onChainChanged = () => {
          activeWalletChainId.setValue(wallet.chainId);
        };

        const handleDisconnect = () => {
          onDisconnect(wallet.id);
          if (wallet.removeListener) {
            wallet.removeListener("accountsChanged", onAccountsChanged);
            wallet.removeListener("chainChanged", onChainChanged);
            wallet.removeListener("disconnect", handleDisconnect);
          }
        };

        wallet.addListener("accountsChanged", onAccountsChanged);
        wallet.addListener("chainChanged", onChainChanged);
        wallet.addListener("disconnect", handleDisconnect);
      }
    }
  };

  // side effects

  // save last connected wallet ids to storage
  effect(
    () => {
      const value = connectedWallets.getValue();
      const ids = value.map((wallet) => wallet.id);
      storage.set(CONNECTED_WALLET_IDS, JSON.stringify(ids));
    },
    [connectedWallets],
    false,
  );

  // save active wallet id to storage
  effect(
    () => {
      const value = activeWalletId.getValue();
      if (value) {
        storage.set(ACTIVE_WALLET_ID, value);
      } else {
        storage.remove(ACTIVE_WALLET_ID);
      }
    },
    [activeWalletId],
    false,
  );

  const getStoredConnectedWalletIds = async (): Promise<string[] | null> => {
    try {
      const value = await storage.get(CONNECTED_WALLET_IDS);
      if (value) {
        return JSON.parse(value) as string[];
      }
      return [];
    } catch {
      return [];
    }
  };

  const getStoredActiveWalletId = async (): Promise<string | null> => {
    try {
      const value = await storage.get(ACTIVE_WALLET_ID);
      if (value) {
        return value;
      }

      return null;
    } catch {
      return null;
    }
  };

  return {
    activeWalletId,
    activeWallet,
    connectWallet,
    disconnectWallet,
    setActiveWalletId,
    connectedWallets,
    getStoredConnectedWalletIds,
    getStoredActiveWalletId,
    activeWalletAddress,
    activeWalletChainId,
  };
}
