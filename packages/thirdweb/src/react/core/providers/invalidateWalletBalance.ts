import type { QueryClient } from "@tanstack/react-query";

export function invalidateWalletBalance(
  queryClient: QueryClient,
  chainId?: number,
) {
  queryClient.invalidateQueries({
    queryKey: chainId ? ["walletBalance", chainId] : ["walletBalance"],
  });
  queryClient.invalidateQueries({
    queryKey: chainId
      ? ["internal_account_balance", chainId]
      : ["internal_account_balance"],
  });
  queryClient.invalidateQueries({
    queryKey: chainId ? ["nfts", chainId] : ["nfts"],
  });
  queryClient.invalidateQueries({
    queryKey: chainId ? ["tokens", chainId] : ["tokens"],
  });
}
