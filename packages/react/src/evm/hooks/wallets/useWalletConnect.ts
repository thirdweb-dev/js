import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useWalletConnectV1() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number }) => {
      const { walletConnectV1 } = await import(
        "../../../wallet/wallets/walletConnectV1"
      );
      connect(walletConnectV1(), options);
    },
    [connect],
  );
}

export function useWalletConnect() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number }) => {
      const { walletConnect } = await import(
        "../../../wallet/wallets/walletConnect"
      );
      connect(walletConnect(), options || {});
    },
    [connect],
  );
}
