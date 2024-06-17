import { useSyncExternalStore } from "react";
import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useActiveWalletConnectionStatusCore(
  manager: ConnectionManager,
) {
  const store = manager.activeWalletConnectionStatusStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
