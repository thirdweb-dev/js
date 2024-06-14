import { useSyncExternalStore } from "react";
import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useConnectedWalletsCore(manager: ConnectionManager) {
  const store = manager.connectedWallets;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
