import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useDeviceWallet() {
  const connect = useConnect();
  return useCallback(
    async (options: { chainId?: number; password: string }) => {
      const { deviceWallet } = await import(
        "../../../wallet/wallets/deviceWallet"
      );
      connect(deviceWallet(), options);
    },
    [connect],
  );
}
