import { useCallback } from "react";
import { useConnect } from "@thirdweb-dev/react-core";
import { MetamaskWallet } from "../../../wallet/wallets";

export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(MetamaskWallet, connectOptions),
    [connect],
  );
}
