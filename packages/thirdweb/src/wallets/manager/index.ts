import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";
import { createStore } from "../../reactive/store.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { walletStorage } from "./storage.js";

export type WalletIdToConnectedWalletMap = Map<string, Wallet>;
export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "unknown";

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";
const ACTIVE_WALLET_ID = "thirdweb:active-wallet-id";

/**
 * Create a connection manager for Wallet connections
 * @example
 * ```ts
 * const manager = createConnectionManager();
 * ```
 * @returns A connection manager object
 */
export function createConnectionManager() {
  // stores

  // active wallet/account
  const activeWallet = createStore<Wallet | undefined>(undefined);
  const activeAccount = createStore<Account | undefined>(undefined);
  const activeWalletChainId = createStore<bigint | undefined>(undefined);
  const activeWalletConnectionStatus = createStore<ConnectionStatus>("unknown");

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
    if (activeWallet.getValue() === wallet) {
      activeWallet.setValue(undefined);
      activeAccount.setValue(undefined);
      activeWalletChainId.setValue(undefined);
      activeWalletConnectionStatus.setValue("disconnected");
    }
  };

  const disconnectWallet = (wallet: Wallet) => {
    onWalletDisconnect(wallet);
    wallet.disconnect();
  };

  const setActiveWallet = (wallet: Wallet) => {
    const account = wallet.account;
    if (!account) {
      throw new Error("Can not a wallet without an account as active");
    }

    // also add it to connected wallets if it's not already there
    const _connectedWalletsMap = walletIdToConnectedWalletMap.getValue();
    if (!_connectedWalletsMap.has(wallet.metadata.id)) {
      addConnectedWallet(wallet);
    }

    // update active states
    activeWallet.setValue(wallet);
    activeAccount.setValue(account);
    activeWalletChainId.setValue(wallet.chainId);
    activeWalletConnectionStatus.setValue("connected");

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

          activeAccount.setValue(newAccount);
        }
      };

      const onChainChanged = (chainId: string) => {
        activeWalletChainId.setValue(BigInt(chainId));
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

      walletStorage.set(CONNECTED_WALLET_IDS, JSON.stringify(ids));
    },
    [connectedWallets],
    false,
  );

  // save active wallet id to storage
  effect(
    () => {
      const value = activeWallet.getValue()?.metadata.id;
      if (value) {
        walletStorage.set(ACTIVE_WALLET_ID, value);
      } else {
        walletStorage.remove(ACTIVE_WALLET_ID);
      }
    },
    [activeWallet],
    false,
  );

  const switchActiveWalletChain = async (chainId: number | bigint) => {
    const wallet = activeWallet.getValue();
    if (!wallet) {
      throw new Error("no wallet found");
    }

    if (!wallet.switchChain) {
      throw new Error("wallet does not support switching chains");
    }

    await wallet.switchChain(chainId);
  };

  return {
    // account
    activeWallet,
    activeAccount,
    connectedWallets,
    addConnectedWallet,
    disconnectWallet,
    setActiveWallet,
    activeWalletChainId,
    switchActiveWalletChain,
    activeWalletConnectionStatus,
    isAutoConnecting,
    removeConnectedWallet,
  };
}

/**
 *
 * @internal
 */
export async function getStoredConnectedWalletIds(): Promise<string[] | null> {
  try {
    const value = await walletStorage.get(CONNECTED_WALLET_IDS);
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
export async function getStoredActiveWalletId(): Promise<string | null> {
  try {
    const value = await walletStorage.get(ACTIVE_WALLET_ID);
    if (value) {
      return value;
    }

    return null;
  } catch {
    return null;
  }
}
