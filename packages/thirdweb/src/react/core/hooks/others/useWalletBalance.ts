import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  type GetWalletBalanceOptions,
  getWalletBalance,
} from "../../../../wallets/utils/getWalletBalance.js";

// NOTE: Do not use useConnectUI here - because this hook is also used outside of Connect UI context

/**
 * Custom hook to fetch the balance of a wallet for a specific token.
 * @param options - The options for fetching the wallet balance.
 * @returns The result of the query.
 * @internal
 */
export function useWalletBalance(options: Partial<GetWalletBalanceOptions>) {
  const { chain, address, tokenAddress, client } = options;
  const query = queryOptions({
    queryKey: [
      "walletBalance",
      chain?.id || -1,
      address || "0x0",
      { tokenAddress },
    ] as const,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      if (!client) {
        throw new Error("client is required");
      }
      if (!address) {
        throw new Error("address is required");
      }
      return getWalletBalance({ chain, client, address, tokenAddress });
    },
    enabled: !!chain && !!client && !!address,
  });
  return useQuery(query);
}
