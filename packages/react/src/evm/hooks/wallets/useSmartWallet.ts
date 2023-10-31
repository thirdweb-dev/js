import { type WalletConfig, useConnect } from "@thirdweb-dev/react-core";
import type { SmartWalletConfigOptions } from "../../../wallet/wallets/smartWallet/types";
import type { SmartWalletConnectionArgs } from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { useCallback } from "react";

export function useSmartWallet() {
  const connect = useConnect();
  return useCallback(
    async (
      wallet: WalletConfig<any>,
      options: SmartWalletConnectionArgs & SmartWalletConfigOptions,
    ) => {
      const { smartWallet } = await import(
        "../../../wallet/wallets/smartWallet/smartWallet"
      );
      return connect(smartWallet(wallet, options), options);
    },
    [connect],
  );
}
