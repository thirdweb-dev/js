import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

/**
 * @deprecated use the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook instead
 * @internal
 */
export function useFrameWallet() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { frameWallet } = await import(
        "../../../wallet/wallets/frame/frameWallet"
      );
      return connect(frameWallet(), connectOptions);
    },
    [connect],
  );
}
