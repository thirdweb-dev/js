import { useSyncExternalStore } from "react";
import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useActiveWalletChainCore(manager: ConnectionManager) {
  const store = manager.activeWalletChainStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
