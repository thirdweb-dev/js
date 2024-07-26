import { useSyncExternalStore } from "react";
import { useConnectionManager } from "../../providers/connection-manager.js";

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
  const manager = useConnectionManager();
  const store = manager.activeWalletStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
