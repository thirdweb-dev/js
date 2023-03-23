import { WalletConnectV1, WalletConnect } from "../../../wallet/wallets";
import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useWalletConnectV1() {
  const connect = useConnect();
  return useCallback(
    (options?: { chainId?: number }) => connect(WalletConnectV1, options),
    [connect],
  );
}

export function useWalletConnect() {
  const connect = useConnect();
  return useCallback(
    (options?: { chainId?: number }) => connect(WalletConnect, options || {}),
    [connect],
  );
}
