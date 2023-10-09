import { splitsKeys } from "..";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useToast } from "@chakra-ui/react";
import { useSDKChainId } from "@thirdweb-dev/react";
import type { Split } from "@thirdweb-dev/sdk";
import {
  BalanceQueryRequest,
  BalanceQueryResponse,
} from "pages/api/moralis/balances";
import invariant from "tiny-invariant";
import { parseErrorToMessage } from "utils/errorParser";

export function useSplitData(contract?: Split) {
  return useQueryWithNetwork(
    splitsKeys.list(contract?.getAddress()),
    async () => contract?.getAllRecipients(),
    {
      enabled: !!contract,
    },
  );
}
export function useSplitBalances(contractAddress?: string) {
  const chainId = useSDKChainId();
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

export function useSplitDistributeFunds(contract?: Split) {
  const contractAddress = contract?.getAddress();
  const balances = useSplitBalances(contractAddress);
  const toast = useToast();

  return useMutationWithInvalidate(
    async () => {
      invariant(contract, "split contract is not ready");
      invariant(balances.data, "No balances to distribute");

      const distributions = (balances.data || [])
        .filter((token) => token.display_balance !== "0.0")
        .map(async (currency) => {
          if (currency.name === "Native Token") {
            await contract
              .distribute()
              .then(() => {
                toast({
                  position: "bottom",
                  variant: "solid",
                  title: `Success`,
                  description: `Successfully distributed ${currency.name}`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              })
              .catch((err: unknown) => {
                toast({
                  position: "bottom",
                  variant: "solid",
                  title: `Error distributing ${currency.name}`,
                  description: parseErrorToMessage(err),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              });
          } else {
            await contract
              .distributeToken(currency.token_address)
              .then(() => {
                toast({
                  position: "bottom",
                  variant: "solid",
                  title: `Success`,
                  description: `Successfully distributed ${currency.name}`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              })
              .catch((err: unknown) => {
                toast({
                  position: "bottom",
                  variant: "solid",
                  title: `Error distributing ${currency.name}`,
                  description: parseErrorToMessage(err),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              });
          }
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
