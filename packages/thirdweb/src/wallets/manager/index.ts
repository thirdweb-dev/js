import type { Chain } from "../../chains/types.js";
import { cacheChains } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { computedStore } from "../../reactive/computedStore.js";
import { effect } from "../../reactive/effect.js";
import { createStore } from "../../reactive/store.js";
import { stringify } from "../../utils/json.js";
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import { deleteConnectParamsFromStorage } from "../../utils/storage/walletStorage.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { smartWallet } from "../smart/smart-wallet.js";
import type { SmartWalletOptions } from "../smart/types.js";
import type { WalletId } from "../wallet-types.js";

type WalletIdToConnectedWalletMap = Map<string, Wallet>;
export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "unknown";

const CONNECTED_WALLET_IDS = "thirdweb:connected-wallet-ids";
const LAST_ACTIVE_EOA_ID = "thirdweb:active-wallet-id";
const LAST_ACTIVE_CHAIN = "thirdweb:active-chain";

export type ConnectionManager = ReturnType<typeof createConnectionManager>;
export type ConnectManagerOptions = {
  client: ThirdwebClient;
  accountAbstraction?: SmartWalletOptions;
  setWalletAsActive?: boolean;
  onConnect?: (wallet: Wallet) => void;
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
    createStore<ConnectionStatus>("unknown");

  const definedChainsStore = createStore<Map<number, Chain>>(new Map());

  // update global cachedChains when defined Chains store updates
  effect(() => {
    cacheChains([...definedChainsStore.getValue().values()]);
  }, [definedChainsStore]);

  // change the active chain object to use the defined chain object
  effect(() => {
    const chainVal = activeWalletChainStore.getValue();
    if (!chainVal) {
      return;
    }

    const definedChain = definedChainsStore.getValue().get(chainVal.id);

    if (!definedChain || definedChain === chainVal) {
      return;
    }

    // update active chain store
    activeWalletChainStore.setValue(definedChain);
  }, [definedChainsStore, activeWalletChainStore]);

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
    if (oldValue.has(wallet.id)) {
      return;
    }
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
    deleteConnectParamsFromStorage(storage, wallet.id);
    removeConnectedWallet(wallet);

    // if disconnecting the active wallet
    if (activeWalletStore.getValue() === wallet) {
      storage.removeItem(LAST_ACTIVE_EOA_ID);
      activeAccountStore.setValue(undefined);
      activeWalletChainStore.setValue(undefined);
      activeWalletStore.setValue(undefined);
      activeWalletConnectionStatusStore.setValue("disconnected");
    }
  };

  const disconnectWallet = (wallet: Wallet) => {
    onWalletDisconnect(wallet);
    wallet.disconnect();
  };

  // handle the connection logic, but don't set the wallet as active
  const handleConnection = async (
    wallet: Wallet,
    options?: ConnectManagerOptions,
  ) => {
    const account = wallet.getAccount();
    if (!account) {
      throw new Error("Cannot set a wallet without an account as active");
    }

    const activeWallet = await (async () => {
      if (options?.accountAbstraction && !isSmartWallet(wallet)) {
        return await handleSmartWalletConnection(
          wallet,
          options.client,
          options.accountAbstraction,
          onWalletDisconnect,
        );
      } else {
        return wallet;
      }
    })();

    await storage.setItem(LAST_ACTIVE_EOA_ID, wallet.id);

    // add personal wallet to connected wallets list even if it's not the active one
    addConnectedWallet(wallet);

    if (options?.setWalletAsActive !== false) {
      handleSetActiveWallet(activeWallet);
    }

    wallet.subscribe("accountChanged", async () => {
      // We reimplement connect here to prevent memory leaks
      const newWallet = await handleConnection(wallet, options);
      options?.onConnect?.(newWallet);
    });

    return activeWallet;
  };

  const connect = async (wallet: Wallet, options?: ConnectManagerOptions) => {
    // connectedWallet can be either wallet or smartWallet
    const connectedWallet = await handleConnection(wallet, options);
    options?.onConnect?.(connectedWallet);
    return connectedWallet;
  };

  const handleSetActiveWallet = (activeWallet: Wallet) => {
    const account = activeWallet.getAccount();
    if (!account) {
      throw new Error("Cannot set a wallet without an account as active");
    }

    // also add it to connected wallets if it's not already there
    addConnectedWallet(activeWallet);

    // update active states
    activeWalletStore.setValue(activeWallet);
    activeAccountStore.setValue(account);
    activeWalletChainStore.setValue(activeWallet.getChain());
    activeWalletConnectionStatusStore.setValue("connected");

    // setup listeners

    const onAccountsChanged = (newAccount: Account) => {
      activeAccountStore.setValue(newAccount);
    };

    const unsubAccounts = activeWallet.subscribe(
      "accountChanged",
      onAccountsChanged,
    );

    const unsubChainChanged = activeWallet.subscribe("chainChanged", (chain) =>
      activeWalletChainStore.setValue(chain),
    );
    const unsubDisconnect = activeWallet.subscribe("disconnect", () => {
      handleDisconnect();
    });

    const handleDisconnect = () => {
      onWalletDisconnect(activeWallet);
      unsubAccounts();
      unsubChainChanged();
      unsubDisconnect();
    };
  };

  const setActiveWallet = async (activeWallet: Wallet) => {
    handleSetActiveWallet(activeWallet);
    // do not set smart wallet as last active EOA
    if (activeWallet.id !== "smart") {
      await storage.setItem(LAST_ACTIVE_EOA_ID, activeWallet.id);
    }
  };

  // side effects

  effect(
    () => {
      const _chain = activeWalletChainStore.getValue();
      if (_chain) {
        storage.setItem(LAST_ACTIVE_CHAIN, stringify(_chain));
      } else {
        storage.removeItem(LAST_ACTIVE_CHAIN);
      }
    },
    [activeWalletChainStore],
    false,
  );

  // save last connected wallet ids to storage
  effect(
    async () => {
      const prevAccounts = (await getStoredConnectedWalletIds(storage)) || [];
      const accounts = connectedWallets.getValue();
      const ids = accounts.map((acc) => acc?.id).filter((c) => !!c) as string[];

      storage.setItem(
        CONNECTED_WALLET_IDS,
        stringify(Array.from(new Set([...prevAccounts, ...ids]))),
      );
    },
    [connectedWallets],
    false,
  );

  const switchActiveWalletChain = async (chain: Chain) => {
    const wallet = activeWalletStore.getValue();
    if (!wallet) {
      throw new Error("No active wallet found");
    }

    if (!wallet.switchChain) {
      throw new Error("Wallet does not support switching chains");
    }

    if (isSmartWallet(wallet)) {
      // also switch personal wallet
      const personalWalletId = await getStoredActiveWalletId(storage);
      if (personalWalletId) {
        const personalWallet = connectedWallets
          .getValue()
          .find((w) => w.id === personalWalletId);
        if (personalWallet) {
          await personalWallet.switchChain(chain);
          await wallet.switchChain(chain);
          // reset the active wallet as switch chain recreates a new smart account
          handleSetActiveWallet(wallet);
          return;
        }
      }
      // If we couldn't find the personal wallet, just switch the smart wallet
      await wallet.switchChain(chain);
      handleSetActiveWallet(wallet);
    } else {
      await wallet.switchChain(chain);
    }

    // for wallets that dont implement events, just set it manually
    activeWalletChainStore.setValue(wallet.getChain());
  };

  function defineChains(chains: Chain[]) {
    const currentMapVal = definedChainsStore.getValue();

    // if all chains to be defined are already defined, no need to update the definedChains map
    const allChainsSame = chains.every((c) => {
      const definedChain = currentMapVal.get(c.id);
      // basically a deep equal check
      return stringify(definedChain) === stringify(c);
    });

    if (allChainsSame) {
      return;
    }

    const newMapVal = new Map(currentMapVal);
    for (const c of chains) {
      newMapVal.set(c.id, c);
    }
    definedChainsStore.setValue(newMapVal);
  }

  return {
    activeAccountStore,
    activeWalletChainStore,
    activeWalletConnectionStatusStore,
    activeWalletStore,
    addConnectedWallet,
    connect,
    connectedWallets,
    defineChains,
    disconnectWallet,
    handleConnection,
    isAutoConnecting,
    removeConnectedWallet,
    setActiveWallet,
    switchActiveWalletChain,
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
): Promise<WalletId | null> {
  try {
    const value = await storage.getItem(LAST_ACTIVE_EOA_ID);
    if (value) {
      return value as WalletId;
    }
  } catch {}

  return null;
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
  } catch {}

  return null;
}

/**
 * @internal
 */
export const handleSmartWalletConnection = async (
  eoaWallet: Wallet,
  client: ThirdwebClient,
  options: SmartWalletOptions,
  onWalletDisconnect: (wallet: Wallet) => void,
) => {
  const signer = eoaWallet.getAccount();
  if (!signer) {
    throw new Error("Cannot set a wallet without an account as active");
  }

  const wallet = smartWallet(options);

  await wallet.connect({
    chain: options.chain,
    client: client,
    personalAccount: signer,
  });

  // Disconnect the active wallet when the EOA disconnects if it the active wallet is a smart wallet
  const disconnectUnsub = eoaWallet.subscribe("disconnect", () => {
    handleDisconnect();
  });
  const handleDisconnect = () => {
    disconnectUnsub();
    onWalletDisconnect(wallet);
  };

  return wallet;
};
