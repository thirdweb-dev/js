import type { QueryClient } from "@tanstack/react-query";

export function invalidateWalletBalance(
  queryClient: QueryClient,
  chainId?: number,
) {
  queryClient.invalidateQueries({
    // invalidate any walletBalance queries for this chainId
    // TODO: add wallet address in here if we can get it somehow
    queryKey: chainId ? ["walletBalance", chainId] : ["walletBalance"],
  });
  queryClient.invalidateQueries({
    queryKey: chainId
      ? ["internal_account_balance", chainId]
      : ["internal_account_balance"],
  });
}
