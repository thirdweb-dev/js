import { useCallback, useState } from "react";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type {
  ConnectManagerOptions,
  ConnectionManager,
} from "../../../../wallets/manager/index.js";

export function useConnectCore(
  manager: ConnectionManager,
  options?: ConnectManagerOptions,
) {
  const { connect } = manager;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleConnection = useCallback(
    async (walletOrFn: Wallet | (() => Promise<Wallet>)) => {
      // reset error state
      setError(null);
      if (typeof walletOrFn !== "function") {
        return connect(walletOrFn, options);
      }

      setIsConnecting(true);
      try {
        const w = await walletOrFn();
        return connect(w, options);
      } catch (e) {
        console.error(e);
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connect, options],
  );

  return { connect: handleConnection, isConnecting, error } as const;
}
