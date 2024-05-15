"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { ConnectManagerOptions } from "../../../../wallets/manager/index.js";
import { connectionManager } from "../../connectionManager.js";

/**
 * A hook that returns the active account
 * @returns The active `Account` or `undefined` if no active account is set.
 * @example
 * ```jsx
 * import { useActiveAccount } from "thirdweb/react";
 *
 * const activeAccount = useActiveAccount();
 * ```
 * @walletConnection
 */
export function useActiveAccount() {
  const store = connectionManager.activeAccountStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * A hook that returns the active wallet
 * @returns The active `Wallet` or `undefined` if no active wallet is set.
 * @example
 * ```jsx
 * import { useActiveWallet } from "thirdweb/react";
 *
 * const wallet = useActiveWallet();
 * ```
 * @walletConnection
 */
export function useActiveWallet() {
  const store = connectionManager.activeWalletStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * Switch to blockchain with given chain id in the active wallet.
 * @returns A function to switch to blockchain with given chain id in the active wallet.
 * @example
 * ```jsx
 * import { useSwitchActiveWalletChain } from "thirdweb/react";
 * import { sepolia } from "thirdweb/chains";
 *
 * const switchChain = useSwitchActiveWalletChain();
 *
 * // later in your code
 * <button onClick={() => switchChain(sepolia)}>Switch Chain</button>
 * ```
 * @walletConnection
 */
export function useSwitchActiveWalletChain() {
  return connectionManager.switchActiveWalletChain;
}

/**
 * A hook that returns the chain the active wallet is connected to
 * @returns The chain the active wallet is connected to or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWalletChain } from "thirdweb/react";
 *
 * const chainId = useActiveWalletChain();
 * ```
 * @walletConnection
 */
export function useActiveWalletChain() {
  const store = connectionManager.activeWalletChainStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * A hook that returns all connected wallets
 * @returns An array of all connected wallets
 * @example
 * ```jsx
 * import { useConnectedWallets } from "thirdweb/react";
 *
 * const wallets = useConnectedWallets();
 * ```
 * @walletConnection
 */
export function useConnectedWallets() {
  const store = connectionManager.connectedWallets;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * A hook that lets you set the active wallet.
 * @returns A function that lets you set the active wallet.
 * @example
 * ```jsx
 * import { useSetActiveWallet } from "thirdweb/react";
 *
 * const setActiveAccount = useSetActiveWallet();
 *
 * // later in your code
 * await setActiveAccount(account);
 * ```
 * @walletConnection
 */
export function useSetActiveWallet() {
  return connectionManager.setActiveWallet;
}

/**
 * A hook to set a wallet as active wallet
 * @returns A function that lets you connect a wallet.
 * @example
 * ```jsx
 * import { useConnect } from "thirdweb/react";
 * import { createWallet } from "thirdweb/wallets";
 *
 * function Example() {
 *   const { connect, isConnecting, error } = useConnect();
 *   return (
 *     <button
 *       onClick={() =>
 *         connect(async () => {
 *           // instantiate wallet
 *           const wallet = createWallet("io.metamask");
 *           // connect wallet
 *           await wallet.connect();
 *           // return the wallet
 *           return wallet;
 *         })
 *       }
 *     >
 *       Connect
 *     </button>
 *   );
 * }
 * ```
 * @walletConnection
 */
export function useConnect(options?: ConnectManagerOptions) {
  const { connect } = connectionManager;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleConnection = useCallback(
    async (walletOrFn: Wallet | (() => Promise<Wallet>)) => {
      // reset error state
      setError(null);
      if (typeof walletOrFn !== "function") {
        return connect(walletOrFn, options);
      }

      setIsConnecting(true);
      try {
        const w = await walletOrFn();
        return connect(w, options);
      } catch (e) {
        console.error(e);
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connect, options],
  );

  return { connect: handleConnection, isConnecting, error } as const;
}

/**
 * Disconnect from given account
 * @example
 * ```jsx
 * import { useDisconnect, useActiveWallet } from "thirdweb/react";
 *
 * function Example() {
 *   const { disconnect } = useDisconnect();
 *   const wallet = useActiveWallet();
 *
 *   return (
 *     <button onClick={() => disconnect(wallet)}>
 *       Disconnect
 *     </button>
 *   );
 * }
 * ```
 * @walletConnection
 * @returns An object with a function to disconnect an account
 */
export function useDisconnect() {
  const disconnect = connectionManager.disconnectWallet;
  return { disconnect };
}

/**
 * A hook that returns the active account's connection status.
 * @example
 * ```jsx
 * import { useActiveWalletConnectionStatus } from "thirdweb/react";
 *
 * function Example() {
 *   const status = useActiveWalletConnectionStatus();
 *   console.log(status);
 *   return <div> ... </div>;
 * }
 * ```
 * @returns The active wallet's connection status.
 * @walletConnection
 */
export function useActiveWalletConnectionStatus() {
  const store = connectionManager.activeWalletConnectionStatusStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * A hook that returns the active wallet's connection status.
 * @example
 * ```jsx
 * function Example() {
 *   const setActive = useSetActiveWalletConnectionStatus();
 *
 *   // when you want to set an account as active
 *   setActive(account)
 * }
 * ```
 * @returns The active wallet's connection status.
 * @internal
 */
export function useSetActiveWalletConnectionStatus() {
  return connectionManager.activeWalletConnectionStatusStore.setValue;
}

/**
 * A hook to check if the auto connect is in progress.
 * @example
 * ```jsx
 * function Example() {
 *   const isAutoConnecting = useIsAutoConnecting();
 *
 *   return <div> ... </div>;
 * }
 * ```
 * @returns A boolean indicating if the auto connect is in progress.
 * @walletConnection
 */
export function useIsAutoConnecting() {
  const store = connectionManager.isAutoConnecting;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
