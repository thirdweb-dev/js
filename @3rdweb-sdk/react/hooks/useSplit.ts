import { useActiveChainId, useContractMetadata } from ".";
import { splitsKeys } from "..";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useWeb3 } from "@3rdweb-sdk/react";
import { useToast } from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { useSplit, useToken } from "@thirdweb-dev/react";
import { CURRENCIES } from "constants/currencies";
import { ethers } from "ethers";
import invariant from "tiny-invariant";
import { parseErrorToMessage } from "utils/errorParser";
import { SUPPORTED_CHAIN_ID } from "utils/network";
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

const getCurrencies = async (chainId?: number, contractAddress?: string) => {
  const res = await fetch("/api/moralis/balances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chain: `0x${chainId?.toString(16)}` as any,
      address: contractAddress,
    }),
  });

  const data = await res.json();

  const currencies: Array<{
    token_address: string;
    name?: string;
    symbol?: string;
    decimals: number;
  }> = data.map((token: any) => {
    if (isAddressZero(token.token_address)) {
      const native = CURRENCIES[chainId as SUPPORTED_CHAIN_ID].find((c) =>
        isAddressZero(c.address),
      );

      return {
        token_address: AddressZero,
        name: native?.name,
        symbol: native?.symbol,
        decimals: 18,
      };
    } else {
      return token;
    }
  });

  return currencies;
};

export function useSplitBalances(contractAddress?: string) {
  const { address } = useWeb3();
  const chainId = useActiveChainId();

  const splitsContract = useSplit(contractAddress);

  const currencies = useQueryWithNetwork(
    splitsKeys.currencies(contractAddress),
    () => getCurrencies(chainId, contractAddress),
    { enabled: !!chainId && !!contractAddress },
  );

  return useQueryWithNetwork(
    splitsKeys.balances(contractAddress),
    async () =>
      Promise.all(
        (currencies.data || []).map(async (currency) => {
          let balance = ethers.utils.formatEther("0").toString();
          if (
            isAddressZero(currency.token_address) &&
            splitsContract &&
            address
          ) {
            balance = ethers.utils
              .formatEther(await splitsContract.balanceOf(address))
              .toString();
          } else if (splitsContract && address) {
            balance = (
              await splitsContract.balanceOfToken(
                address,
                currency.token_address,
              )
            ).displayValue;
          }

          return { ...currency, balance };
        }),
      ),
    {
      enabled: !!chainId && !!contractAddress && !!address && !!currencies,
    },
  );
}

export function useDistributeNumOfTransactions(contractAddress?: string) {
  const balances = useSplitBalances(contractAddress);
  if (!balances.data || balances.isLoading) {
    return 0;
  }
  return balances.data.length;
}

export function useSplitDistributeFunds(contractAddress?: string) {
  const balances = useSplitBalances(contractAddress);
  const splitsContract = useSplit(contractAddress);
  const toast = useToast();
  return useMutationWithInvalidate(
    async () => {
      invariant(splitsContract, "split contract is not ready");
      invariant(balances.data, "No balances to distribute");

      const distributions = (balances.data || [])
        .filter((token) => parseFloat(token.balance) > 0)
        .map(async (currency) => {
          if (isAddressZero(currency.token_address)) {
            await splitsContract
              .distribute()
              .then(() => {
                toast({
                  title: `Success`,
                  description: `Succesfully distributed ${currency.name}`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              })
              .catch((err: unknown) => {
                toast({
                  title: `Error distributing ${currency.name}`,
                  description: parseErrorToMessage(err),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              });
          } else {
            await splitsContract
              .distributeToken(currency.token_address)
              .then(() => {
                toast({
                  title: `Success`,
                  description: `Succesfully distributed ${currency.name}`,
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              })
              .catch((err: unknown) => {
                toast({
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
