"use-client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { Wallet } from "../../wallets/index.js";
import { connectionManager } from "../connectionManager.js";

/**
 * A hook that returns the active wallet.
 * @returns The active wallet or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWallet } from "thirdweb/react";
 *
 * const activeWallet = useActiveWallet();
 * ```
 */
export function useActiveWallet() {
  const store = connectionManager.activeWallet;
  return useSyncExternalStore(store.subscribe, store.getValue);
}

/**
 * A hook that returns the active wallet address.
 * @returns The active wallet address or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWalletAddress } from "thirdweb/react";
 *
 * const activeWalletAddress = useActiveWalletAddress();
 * ```
 */
export function useActiveWalletAddress() {
  const store = connectionManager.activeWalletAddress;
  return useSyncExternalStore(store.subscribe, store.getValue);
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
  return useSyncExternalStore(store.subscribe, store.getValue);
}

/**
 * A hook that returns all connected wallets.
 * @returns An array of all connected wallets.
 * @example
 * ```jsx
 * import { useConnectedWallets } from "thirdweb/react";
 *
 * const activeWalletChainId = useConnectedWallets();
 * ```
 */
export function useConnectedWallets() {
  const store = connectionManager.connectedWallets;
  return useSyncExternalStore(store.subscribe, store.getValue);
}

/**
 * A hook that lets you set the active wallet.
 * @returns A function that lets you set the active wallet.
 * @example
 * ```jsx
 * import { useSetActiveWallet } from "thirdweb/react";
 *
 * const setAciveWallet = useSetActiveWallet();
 *
 * // later in your code
 * setAciveWallet(wallet);
 * ```
 */
export function useSetActiveWallet() {
  return connectionManager.setActiveWalletId;
}

/**
 * A hook that lets you connect a wallet.
 * @returns A function that lets you connect a wallet.
 * @example
 * ```jsx
 * import { useConnect } from "thirdweb/react";
 * import { metamaskWallet } from "thirdweb/wallets";
 *
 * const { connect, isConnecting, error } = useConnect();
 *
 * // later in your code
 * <button> onClick={() => connect(metamaskWallet)}>Connect</button>
 * ```
 */
export function useConnect() {
  const { connectWallet, setActiveWalletId } = connectionManager;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(
    async function (
      options: Wallet | (() => Promise<Wallet>),
      setActive = true,
    ) {
      // reset error state
      setError(null);
      if (typeof options !== "function") {
        connectWallet(options);
        return options;
      }

      setIsConnecting(true);
      try {
        const wallet = await options();
        // add the uuid for this wallet
        connectWallet(wallet);
        if (setActive !== false) {
          setActiveWalletId(wallet.id);
        }
        return wallet;
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connectWallet, setActiveWalletId],
  );

  return { connect, isConnecting, error } as const;
}

/**
 * Disconnect a connected wallet.
 * @example
 * ```jsx
 * import { useDisconnect } from "thirdweb/react";
 *
 * const { disconnect } = useDisconnect();
 *
 * // later in your code
 * <button onClick={() => disconnect(wallet)}>Disconnect</button>
 * ```
 * @returns An object with a function to disconnect a wallet.
 */
export function useDisconnect() {
  const disconnectWallet = connectionManager.disconnectWallet;
  return { disconnectWallet };
}
