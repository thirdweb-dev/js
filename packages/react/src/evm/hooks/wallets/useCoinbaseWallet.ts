import { useCallback } from "react";
import { useConnect } from "@thirdweb-dev/react-core";
import { CoinbaseWallet } from "../../../wallet/wallets";

export function useCoinbaseWallet() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(CoinbaseWallet, connectOptions),
    [connect],
  );
}
