import { useConnect } from "@thirdweb-dev/react-core";
import type { SafeConnectionArgs } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

export function useSafe() {
  const connect = useConnect();
  return useCallback(
    async (connectProps: SafeConnectionArgs) => {
      const { SafeWallet } = await import("../../../wallet/wallets");
      const safeWallet = await connect(SafeWallet, connectProps);
      return safeWallet;
    },
    [connect],
  );
}

// backwards compatibility
export const useGnosis = useSafe;
