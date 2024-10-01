"use client";

import { useSyncExternalStore } from "react";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

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
  const manager = useConnectionManagerCtx("useActiveWalletConnectionStatus");
  const store = manager.activeWalletConnectionStatusStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
