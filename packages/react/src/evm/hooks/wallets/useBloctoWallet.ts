import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { BloctoWalletConfigOptions } from "../../../wallet/wallets/blocto/bloctoWallet";

/**
 * @internal
 * @deprecated use the `ConnectWallet` component or `useConnect` hook instead
 * @walletConnection
 */
export function useBloctoWallet() {
  const connect = useConnect();
  return useCallback(
    async (options?: { chainId?: number } & BloctoWalletConfigOptions) => {
      const { bloctoWallet } = await import(
        "../../../wallet/wallets/blocto/bloctoWallet"
      );
      return connect(
        bloctoWallet({
          appId: options?.appId,
        }),
        options,
      );
    },
    [connect],
  );
}
