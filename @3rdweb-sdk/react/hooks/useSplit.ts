import { useActiveChainId, useContractMetadata } from ".";
import { splitsKeys } from "..";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useToast } from "@chakra-ui/react";
import { useSplit, useToken } from "@thirdweb-dev/react";
import { Split } from "@thirdweb-dev/sdk";
import {
  BalanceQueryRequest,
  BalanceQueryResponse,
} from "pages/api/moralis/balances";
import invariant from "tiny-invariant";
import { parseErrorToMessage } from "utils/errorParser";
import { isAddressZero } from "utils/zeroAddress";

export function useSplitContractMetadata(contractAddres?: string) {
  return useContractMetadata(useToken(contractAddres));
}

export function useSplitData(contractAddress?: string) {
  const splitsContract = useSplit(contractAddress);

  return useQueryWithNetwork(
    splitsKeys.list(contractAddress),
    async () => splitsContract?.getAllRecipients(),
    {
      enabled: !!splitsContract && !!contractAddress,
    },
  );
}
export function useSplitBalances(contractAddress?: string) {
  const chainId = useActiveChainId();
  const currencies = useQueryWithNetwork(
    splitsKeys.currencies(contractAddress),
    () =>
      fetch("/api/moralis/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          address: contractAddress,
        } as BalanceQueryRequest),
      }).then((res) => res.json()) as Promise<BalanceQueryResponse>,
    { enabled: !!chainId && !!contractAddress },
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
          if (isAddressZero(currency.token_address)) {
            await contract
              .distribute()
              .then(() => {
                toast({
                  position: "bottom",
                  variant: "solid",
                  title: `Success`,
                  description: `Succesfully distributed ${currency.name}`,
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
                  description: `Succesfully distributed ${currency.name}`,
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
