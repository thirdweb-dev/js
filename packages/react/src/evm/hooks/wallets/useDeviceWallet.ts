import { DeviceWallet } from "../../../wallet/wallets";
import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useDeviceWallet() {
  const connect = useConnect();
  return useCallback(
    (options: { chainId?: number; password: string }) => {
      connect(DeviceWallet, options);
    },
    [connect],
  );
}
