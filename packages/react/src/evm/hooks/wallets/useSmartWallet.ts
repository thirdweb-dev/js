import { useConnect } from "@thirdweb-dev/react-core";
import type { SmartWalletConfig } from "../../../wallet/wallets/smartWallet/types";
import type { SmartWalletConnectionArgs } from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { useCallback } from "react";

export function useSmartWallet() {
  const connect = useConnect();
  return useCallback(
    async (options: SmartWalletConnectionArgs & SmartWalletConfig) => {
      const { smartWallet } = await import(
        "../../../wallet/wallets/smartWallet/smartWallet"
      );
      return connect(smartWallet(options), options);
    },
    [connect],
  );
}
