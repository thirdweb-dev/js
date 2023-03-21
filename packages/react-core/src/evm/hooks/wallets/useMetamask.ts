import { MetaMask } from "@thirdweb-dev/wallets/evm/wallets/metamask";
import { useCallback } from "react";
import { useConnect } from "../../../core/hooks/wallet-hooks";

export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(MetaMask, connectOptions || {}),
    [connect],
  );
}
