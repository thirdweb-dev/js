import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useSetActiveWalletCore(manager: ConnectionManager) {
  return manager.setActiveWallet;
}
