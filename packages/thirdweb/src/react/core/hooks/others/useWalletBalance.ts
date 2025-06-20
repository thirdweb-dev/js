import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { Chain } from "../../../../chains/types.js";
import type { Prettify } from "../../../../utils/type-utils.js";
import {
  type GetWalletBalanceOptions,
  type GetWalletBalanceResult,
  getWalletBalance,
} from "../../../../wallets/utils/getWalletBalance.js";

type UseWalletBalanceOptions = Prettify<
  Omit<GetWalletBalanceOptions, "address" | "chain"> & {
    address: string | undefined;
    chain: Chain | undefined;
  }
>;
type UseWalletBalanceQueryOptions = Omit<
  UseQueryOptions<GetWalletBalanceResult>,
  "queryFn" | "queryKey"
>;

/**
 * Fetch the balance of a wallet in native currency or for a specific token.
 * Leave `tokenAddress` undefined to fetch the native token balance.
 * @param options {@link GetWalletBalanceOptions} - The options for fetching the wallet balance.
 * @param options.chain - The chain to fetch the wallet balance from.
 * @param options.address - The address of the wallet to fetch the balance from.
 * @param options.client - The client to use to fetch the wallet balance.
 * @param [options.tokenAddress] - The address of the token to fetch the balance for.
 * @returns {@link GetWalletBalanceResult} The result of the query.
 *
 * @example
 *
 * ### Fetching the native token balance
 *
 * ```ts
 * import { useWalletBalance } from "thirdweb/react";
 *
 * const { data, isLoading, isError } = useWalletBalance({ chain, address, client });
 * console.log("balance", data?.displayValue, data?.symbol);
 * ```
 *
 * ### Fetching a specific token balance
 *
 * ```ts
 * import { useWalletBalance } from "thirdweb/react";
 *
 * const tokenAddress = "0x..."; // the ERC20 token address
 *
 * const { data, isLoading, isError } = useWalletBalance({ chain, address, client, tokenAddress });
 * console.log("balance", data?.displayValue, data?.symbol);
 * ```
 * @wallet
 */
export function useWalletBalance(
  options: UseWalletBalanceOptions,
  queryOptions?: UseWalletBalanceQueryOptions,
): UseQueryResult<GetWalletBalanceResult> {
  const { chain, address, tokenAddress, client } = options;
  return useQuery({
    ...queryOptions,
    enabled:
      (queryOptions?.enabled === undefined || queryOptions.enabled) &&
      !!chain &&
      !!client &&
      !!address,
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
      return getWalletBalance({
        address,
        chain,
        client,
        tokenAddress,
      });
    },
    queryKey: [
      "walletBalance",
      chain?.id || -1,
      address || "0x0",
      { tokenAddress },
    ] as const,
  });
}
