import type { ConnectionManager } from "../../../../wallets/manager/index.js";

export function useDisconnectCore(manager: ConnectionManager) {
  const disconnect = manager.disconnectWallet;
  return { disconnect };
}
