import { CoinbaseWallet } from "@thirdweb-dev/wallets/evm/wallets/coinbase-wallet";
import { useCallback } from "react";
import { useConnect } from "../../../core/hooks/wallet-hooks";

export function useCoinbaseWallet() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(CoinbaseWallet, connectOptions || {}),
    [connect],
  );
}
