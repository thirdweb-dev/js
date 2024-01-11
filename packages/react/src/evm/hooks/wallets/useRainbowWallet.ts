import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * @deprecated use the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook instead
 * @internal
 * @walletConnection
 */
export function useRainbowWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { rainbowWallet } = await import(
        "../../../wallet/wallets/rainbow/RainbowWallet"
      );
      return connect(rainbowWallet(), connectOptions);
    },
    [connect],
  );
}
