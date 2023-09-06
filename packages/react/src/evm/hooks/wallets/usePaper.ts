import { useConnect, useWallet } from "@thirdweb-dev/react-core";
import {
  PaperWallet,
  walletIds,
  PaperWalletAdditionalOptions,
} from "@thirdweb-dev/wallets";
import { useCallback, useEffect } from "react";
import {
  useQuery,
  UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";

type PaperConfig = Omit<PaperWalletAdditionalOptions, "chain" | "chains">;

export function usePaperWallet() {
  const connect = useConnect();
  return useCallback(
    async (options: { chainId?: number; email?: string } & PaperConfig) => {
      const { paperWallet } = await import(
        "../../../wallet/wallets/paper/paperWallet"
      );
      return connect(paperWallet({ paperClientId: options.paperClientId }), {
        chainId: options.chainId,
        email: options.email,
      });
    },
    [connect],
  );
}

export function usePaperWalletUserEmail(): UseQueryResult<
  string | undefined,
  string
> {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  const emailQuery = useQuery<string | undefined, string>(
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
