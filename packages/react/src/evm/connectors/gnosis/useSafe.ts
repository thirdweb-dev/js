import { useConnect } from "@thirdweb-dev/react-core";
import type { SafeConnectionArgs } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

/**
 * @deprecated use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) instead
 * @walletConnection
 * @internal
 */
export function useSafe() {
  const connect = useConnect();
  return useCallback(
    async (connectProps: SafeConnectionArgs) => {
      const { safeWallet } = await import(
        "../../../wallet/wallets/safe/safeWallet"
      );
      return connect(safeWallet(), connectProps);
    },
    [connect],
  );
}

// for backwards compatibility

/**
 * @deprecated use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) instead
 * @walletConnection
 * @internal
 */
export const useGnosis = useSafe;
