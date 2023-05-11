import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

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
