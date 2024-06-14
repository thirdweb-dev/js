import { useSyncExternalStore } from "react";
import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useActiveAccountCore(manager: ConnectionManager) {
  const store = manager.activeAccountStore;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
