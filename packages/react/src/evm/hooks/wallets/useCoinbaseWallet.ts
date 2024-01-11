import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * @walletConnection
 * @deprecated use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook instead
 * @internal
 */
export function useCoinbaseWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { coinbaseWallet } = await import(
        "../../../wallet/wallets/coinbase/coinbaseWallet"
      );
      return connect(coinbaseWallet(), connectOptions);
    },
    [connect],
  );
}
