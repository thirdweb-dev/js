import { WalletConnectV1 } from "@thirdweb-dev/wallets/evm/wallets/wallet-connect-v1";
import { useCallback } from "react";
import { useConnect } from "../../../core/hooks/wallet-hooks";

export function useWalletConnect() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(WalletConnectV1, connectOptions || {}),
    [connect],
  );
}
