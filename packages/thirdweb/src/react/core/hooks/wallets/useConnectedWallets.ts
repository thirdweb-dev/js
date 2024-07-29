import { useSyncExternalStore } from "react";
import { useConnectionManager } from "../../providers/connection-manager.js";

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
  const manager = useConnectionManager();
  const store = manager.connectedWallets;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
