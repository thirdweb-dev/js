import { CoinbaseWallet } from "../../../wallet/wallets";
import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useCoinbaseWallet() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(CoinbaseWallet, connectOptions),
    [connect],
  );
}
