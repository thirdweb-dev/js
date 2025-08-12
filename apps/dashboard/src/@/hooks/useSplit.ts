import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type Chain,
  sendAndConfirmTransaction,
  type ThirdwebClient,
  type ThirdwebContract,
} from "thirdweb";
import { distribute, distributeByToken } from "thirdweb/extensions/split";
import { getOwnedTokens } from "thirdweb/insight";
import { useActiveAccount } from "thirdweb/react";
import invariant from "tiny-invariant";
import { parseError } from "../utils/errorParser";

function getTokenBalancesQuery(params: {
  ownerAddress: string;
  client: ThirdwebClient;
  chain: Chain;
}) {
  return queryOptions({
    queryFn: async () => {
      return getOwnedTokens({
        client: params.client,
        chains: [params.chain],
        ownerAddress: params.ownerAddress,
        queryOptions: {
          include_native: "true",
        },
      });
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
            currency.name === "Native Token"
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
        });

      return await Promise.all(distributions);
    },
    onSettled: () => {
      queryClient.invalidateQueries(getTokenBalancesQuery(params));
    },
  });
}
