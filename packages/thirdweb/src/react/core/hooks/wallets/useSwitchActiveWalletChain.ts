import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useSwitchActiveWalletChainCore(manager: ConnectionManager) {
  return manager.switchActiveWalletChain;
}
