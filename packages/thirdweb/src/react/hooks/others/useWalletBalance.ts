import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  getTokenBalance,
  type GetTokenBalanceOptions,
} from "../../../wallets/index.js";
import { getChainIdFromChain } from "../../../chain/index.js";

/**
 * Custom hook to fetch the balance of a wallet for a specific token.
 * @param options - The options for fetching the wallet balance.
 * @returns The result of the query.
 * @internal
 */
export function useWalletBalance(options: Partial<GetTokenBalanceOptions>) {
  const { chain, client, wallet, tokenAddress } = options;
  const query = queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "walletBalance",
      `${getChainIdFromChain(chain ?? -1)}`,
      wallet?.address || "0x0",
      { tokenAddress },
    ] as const,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      if (!client) {
        throw new Error("client is required");
      }
      if (!wallet) {
        throw new Error("wallet is required");
      }
      return getTokenBalance({ chain, client, wallet, tokenAddress });
    },
  });
  return useQuery(query);
}
