import { useConnect } from "@thirdweb-dev/react-core";
import type { SafeConnectionArgs } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

export function useSafe() {
  const connect = useConnect();
  return useCallback(
    async (connectProps: SafeConnectionArgs) => {
      const { safeWallet } = await import(
        "../../../wallet/wallets/safe/safeWallet"
      );
      return connect(safeWallet(), connectProps);
    },
    [connect],
  );
}

// backwards compatibility
export const useGnosis = useSafe;
