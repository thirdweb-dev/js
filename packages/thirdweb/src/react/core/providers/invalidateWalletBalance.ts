import type { QueryClient } from "@tanstack/react-query";

export function invalidateWalletBalance(
  queryClient: QueryClient,
  chainId?: number,
) {
  return queryClient.invalidateQueries({
    // invalidate any walletBalance queries for this chainId
    // TODO: add wallet address in here if we can get it somehow
    queryKey: ["walletBalance", chainId] as const,
  });
}
