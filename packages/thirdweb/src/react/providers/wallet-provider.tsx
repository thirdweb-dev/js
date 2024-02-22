import { useCallback, useState, useSyncExternalStore } from "react";
import { connectionManager } from "../connectionManager.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";

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
  const store = connectionManager.activeAccount;
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
  const store = connectionManager.activeWallet;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * Switch to blockchain with given chain id in the active wallet.
 * @returns A function to switch to blockchain with given chain id in the active wallet.
 * @example
 * ```jsx
 * import { useSwitchActiveWalletChain } from "thirdweb/react";
 *
 * const switchChain = useSwitchActiveWalletChain();
 *
 * // later in your code
 * <button onClick={() => switchChain(chainId)}>Switch Chain</button>
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
  const store = connectionManager.activeWalletChain;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}

/**
 * A hook that returns all connected accounts
 * @returns An array of all connected accounts
 * @example
 * ```jsx
 * import { useConnectedAccounts } from "thirdweb/react";
 *
 * const accounts = useConnectedAccounts();
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
 * setActiveAccount(account);
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
 * import { metamaskWallet } from "thirdweb/wallets";
 *
 * function Example() {
 *   const { connect, isConnecting, error } = useConnect();
 *   return (
 *     <button
 *       onClick={() =>
 *         connect(async () => {
 *           // instantiate wallet
 *           const wallet = metamaskWallet();
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
export function useConnect() {
  const { setActiveWallet } = connectionManager;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(
    async function (options: Wallet | (() => Promise<Wallet>)) {
      // reset error state
      setError(null);
      if (typeof options !== "function") {
        setActiveWallet(options);
        return options;
      }

      setIsConnecting(true);
      try {
        const wallet = await options();
        // add the uuid for this wallet
        setActiveWallet(wallet);
        return wallet;
      } catch (e) {
        console.error(e);
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [setActiveWallet],
  );

  return { connect, isConnecting, error } as const;
}

/**
 * Disconnect from given account
 * @example
 * ```jsx
 * import { useDisconnect } from "thirdweb/react";
 *
 * function Example() {
 *   const { disconnect } = useDisconnect();
 *
 *   return (
 *     <button onClick={() => disconnect(account)}>
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
  const store = connectionManager.activeWalletConnectionStatus;
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
  return connectionManager.activeWalletConnectionStatus.setValue;
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
