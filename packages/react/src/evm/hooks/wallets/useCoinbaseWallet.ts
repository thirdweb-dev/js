import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

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
