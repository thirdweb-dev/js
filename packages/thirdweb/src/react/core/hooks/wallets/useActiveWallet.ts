import { useSyncExternalStore } from "react";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

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
  const manager = useConnectionManagerCtx("useActiveWallet");
  const store = manager.activeWalletStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
