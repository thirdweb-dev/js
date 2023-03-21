import type { SafeConnectionArgs } from "@thirdweb-dev/wallets/evm/wallets/safe";
import { useCallback } from "react";
import { useConnect } from "@thirdweb-dev/react-core";

export function useSafe() {
  const connect = useConnect();
  return useCallback(
    async (connectProps: SafeConnectionArgs) => {
      const { SafeWallet } = await import(
        "@thirdweb-dev/wallets/evm/wallets/safe"
      );
      const safeWallet = await connect(SafeWallet, connectProps);
      return safeWallet;
    },
    [connect],
  );
}

// backwards compatibility
export const useGnosis = useSafe;
