import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { metamaskWallet } = await import(
        "../../../wallet/wallets/metamask/metamaskWallet"
      );
      connect(metamaskWallet(), connectOptions);
    },
    [connect],
  );
}
