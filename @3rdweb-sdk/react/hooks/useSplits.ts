import { useWeb3 } from "@3rdweb-sdk/react";
import { useToast } from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { CURRENCIES } from "constants/currencies";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { parseErrorToMessage } from "utils/errorParser";
import { SUPPORTED_CHAIN_ID } from "utils/network";
import { isAddressZero, OtherAddressZero } from "utils/zeroAddress";
import { useActiveChainId, useContractMetadata } from ".";
import { splitsKeys } from "..";
import { useQueryWithNetwork } from "./query/useQueryWithNetwork";
import { useSplit, useToken } from "@thirdweb-dev/react";

export function useSplitsContractMetadata(contractAddres?: string) {
  return useContractMetadata(useToken(contractAddres));
}

export function useSplitsData(contractAddress?: string) {
  const splitsContract = useSplit(contractAddress);

  return useQueryWithNetwork(
    splitsKeys.list(contractAddress),
    async () => splitsContract?.getAllRecipients(),
    {
      enabled: !!splitsContract && !!contractAddress,
    },
  );
}

export interface IBalance {
  address: string;
  name: string;
  symbol: string;
  balance: string;
}

export function useSplitsBalanceAndDistribute(contractAddress?: string) {
  const { address } = useWeb3();
  const toast = useToast();
  const chainId = useActiveChainId();
  // const appAddress = useSingleQueryParam("app");
  const splitsContract = useSplit(contractAddress);
  const [loading, setLoading] = useState(true);
  const [distributeLoading, setDistributeLoading] = useState(false);
  const [noBalance, setNoBalance] = useState(true);
  const [balances, setBalances] = useState<IBalance[]>([]);
  const [nonZeroBalances, setNonZeroBalances] = useState<IBalance[]>([]);

  const getBalances = useCallback(async () => {
    setLoading(true);
    // const customCurrencyBalances = currencies?.map(async (currency) => {
    //   const fullBalance = await splitsContract?.balanceOfToken(
    //     address as string,
    //     currency.address,
    //   );

    //   const balance = formatUnits(
    //     fullBalance?.value.toString() || "0",
    //     fullBalance?.decimals,
    //   );

    //   return {
    //     address: currency.address,
    //     name: currency.metadata?.name as string,
    //     symbol: currency.metadata?.symbol as string,
    //     balance: balance as string,
    //   };
    // });

    const currencyBalances = CURRENCIES[chainId as SUPPORTED_CHAIN_ID]
      ?.filter((currency) => currency.address !== OtherAddressZero)
      .map(async (currency) => {
        const balance =
          currency.address === AddressZero
            ? formatEther(
                (
                  await splitsContract?.balanceOf(address as string)
                )?.toString() || "0",
              )
            : formatUnits(
                (
                  await splitsContract?.balanceOfToken(
                    address as string,
                    currency.address,
                  )
                )?.value.toString() || "0",
                (
                  await splitsContract?.balanceOfToken(
                    address as string,
                    currency.address,
                  )
                )?.decimals,
              );

        return {
          address: currency.address,
          name: currency.name,
          symbol: currency.symbol,
          balance: balance as string,
        };
      });

    const allBalances = await Promise.all([
      // ...(customCurrencyBalances || []),
      ...currencyBalances,
    ]);

    const nonZeBalances = allBalances.filter((balance: IBalance) => {
      return parseFloat(balance.balance) > 0;
    });

    const displayBalances = allBalances.filter((balance: IBalance) => {
      return (
        parseFloat(balance.balance) > 0 ||
        isAddressZero(balance.address) ||
        balance.symbol === "USDC" ||
        balance.symbol === "USDT"
      );
    });

    setNoBalance(nonZeBalances.length === 0);
    setNonZeroBalances(nonZeBalances);
    setBalances(displayBalances as unknown as IBalance[]);
    setLoading(false);
    // }, [address, chainId, currencies, splitsContract]);
  }, [address, chainId, splitsContract]);

  // useEffect(() => {
  //   if (address && currencies) {
  //     getBalances();
  //   }
  // }, [currencies, address, getBalances]);

  useEffect(() => {
    if (address) {
      getBalances();
    }
  }, [address, getBalances]);

  const distributeFunds = async () => {
    setDistributeLoading(true);
    const distributions = nonZeroBalances?.map(async (balance: IBalance) => {
      if (balance.address === AddressZero) {
        await splitsContract
          ?.distribute()
          .then(() => {
            toast({
              title: `Success`,
              description: `Succesfully distributed ${balance.name}`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          })
          .catch((err: unknown) => {
            toast({
              title: `Error distributing ${balance.name}`,
              description: parseErrorToMessage(err),
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          });
      } else {
        await splitsContract
          ?.distributeToken(balance.address)
          .then(() => {
            toast({
              title: `Success`,
              description: `Succesfully distributed ${balance.name}`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          })
          .catch((err: unknown) => {
            toast({
              title: `Error distributing ${balance.name}`,
              description: parseErrorToMessage(err),
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          });
      }
    });

    await Promise.all(distributions);
    getBalances();
    setDistributeLoading(false);
  };

  return {
    loading,
    distributeLoading,
    noBalance,
    nonZeroBalances,
    balances,
    distributeFunds,
  };
}
