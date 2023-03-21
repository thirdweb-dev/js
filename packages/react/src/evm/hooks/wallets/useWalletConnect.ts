import { useConnect } from "@thirdweb-dev/react-core";
import { WalletConnectV1 } from "@thirdweb-dev/wallets/evm/wallets/wallet-connect-v1";
import { useCallback } from "react";

export function useWalletConnect() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(WalletConnectV1, connectOptions || {}),
    [connect],
  );
}
