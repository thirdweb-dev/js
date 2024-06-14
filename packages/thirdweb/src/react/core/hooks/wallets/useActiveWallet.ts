import { useSyncExternalStore } from "react";
import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useActiveWalletCore(manager: ConnectionManager) {
  const store = manager.activeWalletStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
