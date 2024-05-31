import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  type GetWalletBalanceOptions,
  getWalletBalance,
} from "../../../../wallets/utils/getWalletBalance.js";

// NOTE: Do not use useConnectUI here - because this hook is also used outside of Connect UI context

/**
 * Fetch the balance of a wallet for a specific token.
 * @note Leave `tokenAddress` undefined to fetch the native token balance.
 * @param options {@link GetWalletBalanceOptions} - The options for fetching the wallet balance.
 * @param options.chain - The chain to fetch the wallet balance from.
 * @param options.address - The address of the wallet to fetch the balance from.
 * @param options.client - The client to use to fetch the wallet balance.
 * @param [options.tokenAddress] - The address of the token to fetch the balance for.
 * @returns {@link GetWalletBalanceResult} The result of the query.
 *
 * @example
 * ```ts
 * import { useWalletBalance } from "thirdweb/react";
 *
 * const { data, isLoading, isError } = useWalletBalance({ chain, address, client, tokenAddress });
 * ```
 * @wallet
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
