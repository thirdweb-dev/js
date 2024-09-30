"use client";

import { useSyncExternalStore } from "react";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

/**
 * A hook that returns the chain the active wallet is connected to
 * @returns The chain the active wallet is connected to or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWalletChain } from "thirdweb/react";
 *
 * const activeChain = useActiveWalletChain();
 * ```
 * @walletConnection
 */
export function useActiveWalletChain() {
  const manager = useConnectionManagerCtx("useActiveWalletChain");
  const store = manager.activeWalletChainStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
