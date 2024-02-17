import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  getTokenBalance,
  type GetTokenBalanceOptions,
} from "../../../wallets/utils/getTokenBalance.js";
import { getChainIdFromChain } from "../../../chain/index.js";
import { useThirdwebProviderProps } from "./useThirdwebProviderProps.js";

/**
 * Custom hook to fetch the balance of a wallet for a specific token.
 * @param options - The options for fetching the wallet balance.
 * @returns The result of the query.
 * @internal
 */
export function useWalletBalance(
  options: Omit<Partial<GetTokenBalanceOptions>, "client">,
) {
  const { chain, account, tokenAddress } = options;
  const { client } = useThirdwebProviderProps();
  const query = queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "walletBalance",
      `${getChainIdFromChain(chain ?? -1)}`,
      account?.address || "0x0",
      { tokenAddress },
    ] as const,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      if (!client) {
        throw new Error("client is required");
      }
      if (!account) {
        throw new Error("account is required");
      }
      return getTokenBalance({ chain, client, account, tokenAddress });
    },
  });
  return useQuery(query);
}
