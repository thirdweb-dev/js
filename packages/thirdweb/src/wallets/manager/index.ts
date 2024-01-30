import { createStore } from "../../reactive/store.js";
import type { Wallet } from "../index.js";
import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";

export type ConnectedWalletsMap = Map<string, Wallet>;

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";

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

  // side effects
  effect(() => {
    const value = connectedWallets.getValue();
    const ids = value.map((wallet) => wallet.id);
    console.log("connected wallets are", ids);
    localStorage.setItem(CONNECTED_WALLET_IDS, JSON.stringify(ids));
  }, [connectedWallets]);

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
