import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useBitKeep() {
  const connect = useConnect();
  return useCallback(
    async (connectOptions?: { chainId?: number }) => {
      const { bitkeepWallet } = await import(
        "../../../wallet/wallets/bitkeep/BitKeepWallet"
      );
      return connect(bitkeepWallet(), connectOptions);
    },
    [connect],
  );
}
