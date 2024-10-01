"use client";

import { useSyncExternalStore } from "react";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

/**
 * A hook that returns the active account
 * @returns The active `Account` or `undefined` if no active account is set.
 * @example
 * ```jsx
 * import { useActiveAccount } from "thirdweb/react";
 *
 * const activeAccount = useActiveAccount();
 * console.log("address", activeAccount?.address);
 * ```
 * @walletConnection
 */
export function useActiveAccount() {
  const manager = useConnectionManagerCtx("useActiveAccount");
  const store = manager.activeAccountStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
