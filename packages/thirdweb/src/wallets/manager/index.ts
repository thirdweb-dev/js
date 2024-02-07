import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";
import { createStore } from "../../reactive/store.js";
import type { Account } from "../interfaces/wallet.js";
import { walletStorage, type WalletStorage } from "./storage.js";

export type WalletIdToConnectedAccountMap = Map<string, Account>;
export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "unknown";

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";
const ACTIVE_WALLET_ID = "thirdweb:active-wallet-id";

export type ConnectionManagerOptions = {
  storage?: WalletStorage;
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
export function createConnectionManager(options?: ConnectionManagerOptions) {
  const storage = options?.storage || walletStorage;
  // stores

  // active wallet/account
  const activeAccount = createStore<Account | undefined>(undefined);
  const activeWalletChainId = createStore<bigint | undefined>(undefined);
  const activeWalletConnectionStatus = createStore<ConnectionStatus>("unknown");

  // other connected accounts
  const walletIdToConnectedAccountMap =
    createStore<WalletIdToConnectedAccountMap>(new Map());

  const isAutoConnecting = createStore(false);

  const connectedAccounts = computedStore(() => {
    return Array.from(walletIdToConnectedAccountMap.getValue().values());
  }, [walletIdToConnectedAccountMap]);

  // actions
  const setConnectedAccount = (account: Account) => {
    const oldValue = walletIdToConnectedAccountMap.getValue();
    const newValue = new Map(oldValue);
    newValue.set(account.wallet.metadata.id, account);
    walletIdToConnectedAccountMap.setValue(newValue);
  };

  const onAccountDisconnect = (account: Account) => {
    const currentMap = walletIdToConnectedAccountMap.getValue();
    const newMap = new Map(currentMap);
    newMap.delete(account.wallet.metadata.id);

    walletIdToConnectedAccountMap.setValue(newMap);

    // if disconnecting the active wallet
    if (activeAccount.getValue() === account) {
      activeAccount.setValue(undefined);
      activeWalletChainId.setValue(undefined);
      activeWalletConnectionStatus.setValue("disconnected");
    }
  };

  const disconnect = (account: Account) => {
    onAccountDisconnect(account);
  };

  const setActiveAccount = (account: Account) => {
    activeAccount.setValue(account);

    // const account = walletIdToConnectedAccountMap
    //   .getValue()
    //   .get(walletId || "");

    if (account && account.wallet) {
      activeWalletChainId.setValue(account.wallet.chainId);
      activeWalletConnectionStatus.setValue("connected");

      const wallet = account.wallet;

      // setup listeners
      if (wallet.events) {
        const onAccountsChanged = (addresses: string[]) => {
          const newAddress = addresses[0];
          if (!newAddress) {
            onAccountDisconnect(account);
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
          onAccountDisconnect(account);
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
    }
  };

  // side effects

  // save last connected wallet ids to storage
  effect(
    () => {
      const accounts = connectedAccounts.getValue();
      const ids = accounts
        .map((acc) => acc?.wallet?.metadata.id)
        .filter((c) => !!c) as string[];

      storage.set(CONNECTED_WALLET_IDS, JSON.stringify(ids));
    },
    [connectedAccounts],
    false,
  );

  // save active wallet id to storage
  effect(
    () => {
      const value = activeAccount.getValue()?.wallet?.metadata.id;
      if (value) {
        storage.set(ACTIVE_WALLET_ID, value);
      } else {
        storage.remove(ACTIVE_WALLET_ID);
      }
    },
    [activeAccount],
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

  const switchActiveWalletChain = async (chainId: number | bigint) => {
    const account = activeAccount.getValue();
    if (!account || !account.wallet) {
      throw new Error("no wallet found");
    }

    if (!account.wallet.switchChain) {
      throw new Error("wallet does not support switching chains");
    }

    await account.wallet.switchChain(chainId);
  };

  return {
    // account
    activeAccount: activeAccount,
    connectedAccounts,
    setConnectedAccount,
    // wallet
    disconnectWallet: disconnect,
    setActiveAccount,
    getStoredConnectedWalletIds,
    getStoredActiveWalletId,
    activeWalletChainId: activeWalletChainId,
    switchActiveWalletChain,
    activeWalletConnectionStatus: activeWalletConnectionStatus,
    isAutoConnecting,
  };
}
