import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useSetActiveWalletConnectionStatusCore(
  manager: ConnectionManager,
) {
  return manager.activeWalletConnectionStatusStore.setValue;
}
