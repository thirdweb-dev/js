import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * @deprecated Use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or `useConnect` hook instead
 * @internal
 */
export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number }) => {
      const { metamaskWallet } = await import(
        "../../../wallet/wallets/metamask/metamaskWallet"
      );
      return connect(metamaskWallet(), options);
    },
    [connect],
  );
}
