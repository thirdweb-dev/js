import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * @deprecated use the `ConnectWallet` component or `useConnect` hook instead
 * @internal
 * @walletConnection
 */
export function useTrustWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { trustWallet } = await import(
        "../../../wallet/wallets/trustWallet/TrustWallet"
      );
      return connect(trustWallet(), connectOptions);
    },
    [connect],
  );
}
