import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * const connect = useTrustWallet();
 * connect();
 *
 * @returns connect function to connect to the Trust wallet
 */
export function useTrustWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { trustWallet } = await import("../wallets/trust-wallet");
      return connect(trustWallet(), connectOptions);
    },
    [connect],
  );
}
