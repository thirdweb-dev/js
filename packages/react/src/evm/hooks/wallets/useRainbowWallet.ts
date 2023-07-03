import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

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
