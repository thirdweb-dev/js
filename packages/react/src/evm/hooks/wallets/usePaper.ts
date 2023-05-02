import { useConnect, useWallet } from "@thirdweb-dev/react-core";
import { PaperWallet, walletIds } from "@thirdweb-dev/wallets";
import { useCallback, useEffect } from "react";
import {
  useQuery,
  UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaperSupportedChainId } from "@thirdweb-dev/wallets/evm/connectors/paper";

export function usePaperWallet() {
  const connect = useConnect();
  return useCallback(
    async (options: { chainId?: PaperSupportedChainId; clientId: string }) => {
      const { paperWallet } = await import(
        "../../../wallet/wallets/paperWallet"
      );
      connect(paperWallet({ clientId: options.clientId }), options);
    },
    [connect],
  );
}

export function usePaperWalletUserEmail(): UseQueryResult<string, string> {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  const emailQuery = useQuery<string, string>(
    [wallet?.walletId, "paper-email"],
    () => {
      if (!wallet || wallet.walletId !== walletIds.paper) {
        throw "Not connected to Paper Wallet";
      }
      return (wallet as PaperWallet).getEmail();
    },
    {
      retry: false,
    },
  );

  // Invalidate the query when the wallet changes
  useEffect(() => {
    queryClient.invalidateQueries([wallet?.walletId, "paper-email"]);
  }, [wallet, queryClient]);

  return emailQuery;
}
