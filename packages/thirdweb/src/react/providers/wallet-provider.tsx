import { useCallback, useState, useSyncExternalStore } from "react";
import { connectionManager } from "../connectionManager.js";
import type { Account } from "../../wallets/interfaces/wallet.js";

/**
 * A hook that returns the active account
 * @returns The active `Account` or `undefined` if no active account is set.
 * @example
 * ```jsx
 * import { useActiveAccount } from "thirdweb/react";
 *
 * const activeAccount = useActiveAccount();
 * ```
 */
export function useActiveAccount() {
  const store = connectionManager.activeAccount;
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
 */
export function useSwitchActiveWalletChain() {
  return connectionManager.switchActiveWalletChain;
}

/**
 * A hook that returns the chain id of the blockchain the active wallet is connected to
 * @returns The chain id of the blockchain the active wallet is connected to or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWalletChainId } from "thirdweb/react";
 *
 * const chainId = useActiveWalletChainId();
 * ```
 */
export function useActiveWalletChainId() {
  const store = connectionManager.activeWalletChainId;
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
 */
export function useConnectedAccounts() {
  const store = connectionManager.connectedAccounts;
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
 */
export function useSetActiveAccount() {
  return connectionManager.setActiveAccount;
}

/**
 * A hook that to set an account as the active account and add it to the list of connected accounts.
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
 *           // connect wallet and get account
 *           const account = await wallet.connect();
 *           // return account
 *           return account;
 *         })
 *       }
 *     >
 *       Connect
 *     </button>
 *   );
 * }
 * ```
 */
export function useConnect() {
  const { setConnectedAccount, setActiveAccount } = connectionManager;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(
    async function (
      options: Account | (() => Promise<Account>),
      setActive = true,
    ) {
      // reset error state
      setError(null);
      if (typeof options !== "function") {
        setConnectedAccount(options);
        if (setActive !== false) {
          setActiveAccount(options);
        }
        return options;
      }

      setIsConnecting(true);
      try {
        const account = await options();
        // add the uuid for this wallet
        setConnectedAccount(account);
        if (setActive !== false) {
          setActiveAccount(account);
        }
        return account;
      } catch (e) {
        console.error(e);
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [setActiveAccount, setConnectedAccount],
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
 */
export function useIsAutoConnecting() {
  const store = connectionManager.isAutoConnecting;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
