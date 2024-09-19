import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  BalanceQueryRequest,
  BalanceQueryResponse,
} from "pages/api/moralis/balances";
import { toast } from "sonner";
import { type ThirdwebContract, sendAndConfirmTransaction } from "thirdweb";
import { distribute, distributeByToken } from "thirdweb/extensions/split";
import { useActiveAccount } from "thirdweb/react";
import invariant from "tiny-invariant";

async function getSplitBalances(contract: ThirdwebContract) {
  const query = await fetch("/api/moralis/balances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chainId: contract.chain.id,
      address: contract.address,
    } as BalanceQueryRequest),
  });

  if (query.status >= 400) {
    throw new Error(await query.json().then((r) => r.error));
  }
  return query.json() as Promise<BalanceQueryResponse>;
}

function getQuery(contract: ThirdwebContract) {
  return queryOptions({
    queryKey: ["split-balances", contract.chain.id, contract.address],
    queryFn: () => getSplitBalances(contract),
    retry: false,
  });
}

export function useSplitBalances(contract: ThirdwebContract) {
  return useQuery(getQuery(contract));
}

export function useSplitDistributeFunds(contract: ThirdwebContract) {
  const account = useActiveAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      invariant(account, "No active account");
      const balances =
        // get the cached data if it exists, otherwise fetch it
        queryClient.getQueryData(getQuery(contract).queryKey) ||
        (await queryClient.fetchQuery(getQuery(contract)));

      const distributions = balances
        .filter((token) => token.display_balance !== "0.0")
        .map(async (currency) => {
          const transaction =
            currency.name === "Native Token"
              ? distribute({ contract })
              : distributeByToken({
                  contract,
                  tokenAddress: currency.token_address,
                });
          const promise = sendAndConfirmTransaction({
            transaction,
            account,
          });
          toast.promise(promise, {
            success: `Successfully distributed ${currency.name}`,
            error: `Error distributing ${currency.name}`,
            loading: `Distributing ${currency.name}`,
          });
        });

      return await Promise.all(distributions);
    },
    onSettled: () => {
      queryClient.invalidateQueries(getQuery(contract));
    },
  });
}
