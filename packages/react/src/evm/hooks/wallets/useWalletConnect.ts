import { useConnect } from "@thirdweb-dev/react-core";
import { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

/**
 * @deprecated use the `useWalletConnect` hook instead
 */
export function useWalletConnectV1() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number }) => {
      const { walletConnectV1 } = await import(
        "../../../wallet/wallets/walletConnectV1"
      );
      return connect(walletConnectV1(), options);
    },
    [connect],
  );
}

export function useWalletConnect() {
  const connect = useConnect();
  return useCallback(
    async (options?: {
      chainId?: number;
      projectId?: string;
      qrModalOptions?: WC2_QRModalOptions;
    }) => {
      const { walletConnect } = await import(
        "../../../wallet/wallets/walletConnect/walletConnect"
      );
      return connect(walletConnect(options), options);
    },
    [connect],
  );
}
