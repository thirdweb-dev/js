import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * const connect = useRainbowWallet();
 * connect();
 *
 * @returns connect function to connect to the Rainbow wallet
 */
export function useRainbowWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { rainbowWallet } = await import("../wallets/rainbow-wallet");
      return connect(rainbowWallet(), connectOptions);
    },
    [connect],
  );
}
