import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  getWalletBalance,
  type GetWalletBalanceOptions,
} from "../../../../wallets/utils/getWalletBalance.js";
import { useWalletConnectionCtx } from "./useWalletConnectionCtx.js";

/**
 * Custom hook to fetch the balance of a wallet for a specific token.
 * @param options - The options for fetching the wallet balance.
 * @returns The result of the query.
 * @internal
 */
export function useWalletBalance(
  options: Omit<Partial<GetWalletBalanceOptions>, "client">,
) {
  const { chain, address, tokenAddress } = options;
  const { client } = useWalletConnectionCtx();
  const query = queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
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
