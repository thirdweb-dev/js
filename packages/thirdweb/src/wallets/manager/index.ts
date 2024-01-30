import { createStore } from "../../reactive/store.js";
import type { Wallet } from "../index.js";
import { computedStore } from "../../reactive/computedStore.js";

export type WalletWithId = Wallet & { _id: string };
export type ConnectedWalletsMap = Map<string, WalletWithId>;

/**
 * Create a connection manager for Wallet connections
 * @example
 * ```ts
 * const manager = createConnectionManager();
 * ```
 * @returns A connection manager object
 */
function createConnectionManager() {
  // stores
  const activeWalletId = createStore<string | null>(null);
  const connectedWalletsMap = createStore<ConnectedWalletsMap>(new Map());

  // computed stores
  const activeWallet = computedStore(() => {
    const id = activeWalletId.getValue();
    const record = connectedWalletsMap.getValue();
    return record.get(id || "");
  }, [activeWalletId, connectedWalletsMap]);

  const connectedWallets = computedStore(() => {
    return Array.from(connectedWalletsMap.getValue().values());
  }, [connectedWalletsMap]);

  // actions
  const connectWallet = (wallet: WalletWithId) => {
    const currentMap = connectedWalletsMap.getValue();
    const newMap = new Map(currentMap);
    newMap.set(wallet._id, wallet);
    connectedWalletsMap.setValue(newMap);
    // activeWalletId.setValue(wallet._id); -> should we also set is as active wallet?
  };

  const disconnectWallet = (walletId: string) => {
    const currentMap = connectedWalletsMap.getValue();
    const newMap = new Map(currentMap);
    newMap.delete(walletId);
    connectedWalletsMap.setValue(newMap);

    // if it is the active wallet, set active wallet to null
    if (activeWalletId.getValue() === walletId) {
      activeWalletId.setValue(null);
    }
  };

  const setActiveWalletId = (walletId: string | null) => {
    activeWalletId.setValue(walletId);
  };

  return {
    activeWalletId,
    activeWallet,
    connectWallet,
    disconnectWallet,
    setActiveWalletId,
    connectedWallets,
  };
}

export const connectionManager = /* @__PURE__ */ createConnectionManager();
