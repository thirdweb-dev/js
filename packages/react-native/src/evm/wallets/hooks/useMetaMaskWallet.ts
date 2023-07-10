import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * const connect = useMetaMaskWallet();
 * connect();
 *
 * @returns connect function to connect to the MetaMask wallet
 */
export function useMetaMaskWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { metamaskWallet } = await import("../wallets/metamask-wallet");
      return connect(metamaskWallet(), connectOptions);
    },
    [connect],
  );
}
