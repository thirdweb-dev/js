"use client";

import { useSyncExternalStore } from "react";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

/**
 * A hook that returns the active wallet
 * @returns The active `Wallet` or `undefined` if no active wallet is set.
 * @example
 *
 * ### Basic usage
 * ```jsx
 * import { useActiveWallet } from "thirdweb/react";
 *
 * const wallet = useActiveWallet();
 * ```
 *
 * ### Listen to account change event
 * ```jsx
 * const wallet = useActiveWallet();
 *
 * wallet?.subscribe("accountChanged", (account) => {
 *   console.log(account);
 * });
 * ```
 *
 * ### Listen to multiple accounts changed event
 * ```jsx
 * const wallet = useActiveWallet();
 *
 * wallet?.subscribe("accountsChanged", (addresses) => {
 *   console.log(addresses);
 * });
 * ```
 *
 * ### Listen to network change event
 * ```jsx
 * const wallet = useActiveWallet();
 *
 * wallet?.subscribe("chainChanged", (chain) => {
 *   console.log(chain);
 * });
 * ```
 * @walletConnection
 */
export function useActiveWallet() {
  const manager = useConnectionManagerCtx("useActiveWallet");
  const store = manager.activeWalletStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
