import type {
  BalanceQueryRequest,
  BalanceQueryResponse,
} from "pages/api/moralis/balances";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { distribute, distributeByToken } from "thirdweb/extensions/split";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import invariant from "tiny-invariant";
import { splitsKeys } from "..";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";

export function useSplitBalances(contract: ThirdwebContract) {
  const chainId = contract.chain.id;
  const contractAddress = contract.address;
  const currencies = useQueryWithNetwork(
    splitsKeys.currencies(contractAddress),
    async () => {
      const query = await fetch("/api/moralis/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          address: contractAddress,
        } as BalanceQueryRequest),
      });

      if (query.status >= 400) {
        throw new Error(await query.json().then((r) => r.error));
      }
      return query.json() as Promise<BalanceQueryResponse>;
    },
    { enabled: !!chainId && !!contractAddress, retry: false },
  );
  return currencies;
}

export function useSplitDistributeFunds(contract: ThirdwebContract) {
  const contractAddress = contract.address;
  const balances = useSplitBalances(contract);
  const { mutateAsync } = useSendAndConfirmTransaction();

  return useMutationWithInvalidate(
    async () => {
      invariant(contract, "split contract is not ready");
      invariant(balances.data, "No balances to distribute");
      const distributions = (balances.data || [])
        .filter((token) => token.display_balance !== "0.0")
        .map(async (currency) => {
          const transaction =
            currency.name === "Native Token"
              ? distribute({ contract })
              : distributeByToken({
                  contract,
                  tokenAddress: currency.token_address,
                });
          const promise = mutateAsync(transaction);
          toast.promise(promise, {
            success: `Successfully distributed ${currency.name}`,
            error: `Error distributing ${currency.name}`,
            loading: "Distributing funds",
          });
        });

      return await Promise.all(distributions);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          splitsKeys.currencies(contractAddress),
          splitsKeys.balances(contractAddress),
          splitsKeys.list(contractAddress),
        ]);
      },
    },
  );
}
