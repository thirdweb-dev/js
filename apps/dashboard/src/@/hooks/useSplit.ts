import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type Chain,
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  sendAndConfirmTransaction,
  type ThirdwebClient,
  type ThirdwebContract,
} from "thirdweb";
import type { GetBalanceResult } from "thirdweb/extensions/erc20";
import { distribute, distributeByToken } from "thirdweb/extensions/split";
import { getOwnedTokens } from "thirdweb/insight";
import { useActiveAccount } from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import invariant from "tiny-invariant";
import { parseError } from "../utils/errorParser";
import { tryCatch } from "../utils/try-catch";

function getTokenBalancesQuery(params: {
  ownerAddress: string;
  client: ThirdwebClient;
  chain: Chain;
}) {
  return queryOptions({
    queryFn: async () => {
      const ownedTokenBalancePromise = getOwnedTokens({
        client: params.client,
        chains: [params.chain],
        ownerAddress: params.ownerAddress,
        queryOptions: {
          include_native: "true",
        },
      });

      const result = await tryCatch(ownedTokenBalancePromise);

      // fallback to fetch native token balance with rpc
      if (result.error) {
        const walletBalance = await getWalletBalance({
          address: params.ownerAddress,
          client: params.client,
          chain: params.chain,
        });

        const nativeTokenBalance: GetBalanceResult = {
          name: walletBalance.name,
          value: walletBalance.value,
          decimals: walletBalance.decimals,
          displayValue: walletBalance.displayValue,
          symbol: walletBalance.symbol,
          chainId: params.chain.id,
          tokenAddress: NATIVE_TOKEN_ADDRESS,
        };

        return [nativeTokenBalance];
      }

      return result.data;
    },
    queryKey: ["getOwnedTokens", params.chain.id, params.ownerAddress],
    retry: false,
  });
}

export function useOwnedTokenBalances(params: {
  ownerAddress: string;
  client: ThirdwebClient;
  chain: Chain;
}) {
  return useQuery(getTokenBalancesQuery(params));
}

export function useSplitDistributeFunds(contract: ThirdwebContract) {
  const account = useActiveAccount();
  const queryClient = useQueryClient();

  const params = {
    ownerAddress: contract.address, // because we want to fetch the balance of split contract
    client: contract.client,
    chain: contract.chain,
  };

  return useMutation({
    mutationFn: async () => {
      invariant(account, "No active account");

      const balances =
        // get the cached data if it exists, otherwise fetch it
        queryClient.getQueryData(getTokenBalancesQuery(params).queryKey) ||
        (await queryClient.fetchQuery(getTokenBalancesQuery(params)));

      const distributions = balances
        .filter((token) => token.value !== 0n)
        .map(async (currency) => {
          const transaction =
            getAddress(currency.tokenAddress) ===
            getAddress(NATIVE_TOKEN_ADDRESS)
              ? distribute({ contract })
              : distributeByToken({
                  contract,
                  tokenAddress: currency.tokenAddress,
                });
          const promise = sendAndConfirmTransaction({
            account,
            transaction,
          });

          toast.promise(promise, {
            error: (err) => ({
              message: `Error distributing ${currency.name}`,
              description: parseError(err),
            }),
            loading: `Distributing ${currency.name}`,
            success: `Successfully distributed ${currency.name}`,
          });

          await promise;
        });

      return await Promise.all(distributions);
    },
    onSettled: () => {
      queryClient.invalidateQueries(getTokenBalancesQuery(params));
    },
  });
}
