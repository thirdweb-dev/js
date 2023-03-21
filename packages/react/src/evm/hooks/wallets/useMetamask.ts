import { MetaMask } from "@thirdweb-dev/wallets/evm/wallets/metamask";
import { useCallback } from "react";
import { useConnect } from "@thirdweb-dev/react-core";

export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(MetaMask, connectOptions || {}),
    [connect],
  );
}
