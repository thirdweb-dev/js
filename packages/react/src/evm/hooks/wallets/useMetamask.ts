import { MetamaskWallet } from "../../../wallet/wallets";
import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";

export function useMetamask() {
  const connect = useConnect();
  return useCallback(
    (connectOptions?: { chainId?: number }) =>
      connect(MetamaskWallet, connectOptions),
    [connect],
  );
}
