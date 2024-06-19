import { DistributeButton } from "./components/distribute-button";
import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useBalanceForAddress } from "@3rdweb-sdk/react/hooks/useBalanceForAddress";
import {
  useSplitBalances,
  useSplitData,
} from "@3rdweb-sdk/react/hooks/useSplit";
import {
  Center,
  Flex,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { BigNumber, constants, ethers } from "ethers";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useMemo } from "react";
import { Card, Heading, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export type Balance = {
  name: string;
  token_address: string;
  balance: string;
  display_balance: string;
  decimals: number;
};

interface SplitPageProps {
  contractAddress?: string;
}

export const ContractSplitPage: React.FC<SplitPageProps> = ({
  contractAddress,
}) => {
  const address = useAddress();
  const contractQuery = useContract(contractAddress, "split");
  const configuredChainsRecord = useSupportedChainsRecord();
  const chainId = useDashboardEVMChainId();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;

  const splitQuery = useSplitData(contractQuery.contract);
  const nativeBalanceQuery = useBalanceForAddress(contractAddress);
  const balanceQuery = useSplitBalances(contractAddress);

  const balances = useMemo(() => {
    if (!balanceQuery.data && !nativeBalanceQuery.data) {
      return [];
    }

    return [
      {
        name: "Native Token",
        token_address: constants.AddressZero,
        balance: nativeBalanceQuery?.data?.value?.toString() || "0",
        display_balance: nativeBalanceQuery?.data?.displayValue || "0.0",
        decimals: nativeBalanceQuery?.data?.decimals || 18,
      },
      ...(balanceQuery.data || []).filter((bl) => bl.name !== "Native Token"),
    ];
  }, [balanceQuery.data, nativeBalanceQuery.data]);

  const shareOfBalancesForConnectedWallet = useMemo(() => {
    const activeRecipient = splitQuery.data?.find((r) => r.address === address);
    if (!activeRecipient || !balances) {
      return {};
    }

    return balances.reduce(
      (acc, curr) => {
        return {
          ...acc,
          // convert to bps for BigNumber calculations
          [curr.token_address]: ethers.utils.formatUnits(
            BigNumber.from(curr.balance)
              .mul(activeRecipient.splitPercentage * 100)
              .div(10000),
            curr.decimals,
          ),
        };
      },
      {} as { [address: string]: string },
    );
  }, [splitQuery.data, balances, address]);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!contractQuery?.contract) {
    return null;
  }

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Balances</Heading>
        <Flex gap={4}>
          <DistributeButton
            balances={balances as Balance[]}
            balancesIsLoading={
              balanceQuery.isLoading || nativeBalanceQuery.isLoading
            }
            balancesIsError={balanceQuery.isError && nativeBalanceQuery.isError}
            contractQuery={contractQuery}
          />
        </Flex>
      </Flex>
      <Stack spacing={8}>
        <Flex gap={4} flexDir="column">
          <SimpleGrid spacing={{ base: 3, md: 6 }} columns={{ base: 2, md: 4 }}>
            <Card as={Stat}>
              <StatLabel mb={{ base: 1, md: 0 }}>
                {nativeBalanceQuery.data?.symbol}
              </StatLabel>
              <StatNumber>{nativeBalanceQuery?.data?.displayValue}</StatNumber>
              {shareOfBalancesForConnectedWallet[constants.AddressZero] && (
                <StatNumber>
                  <Text size="body.md">
                    <Text as="span" size="label.md">
                      Your Share:
                    </Text>{" "}
                    {shareOfBalancesForConnectedWallet[constants.AddressZero]}
                  </Text>
                </StatNumber>
              )}
            </Card>
            {balanceQuery.isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              (balanceQuery?.data || [])
                ?.filter((bl) => bl.name !== "Native Token")
                ?.map((balance) => (
                  <Card as={Stat} key={balance.token_address} maxWidth="2xs">
                    <StatLabel as={Heading} size="label.lg">
                      {balance.name === "Native Token"
                        ? chain?.nativeCurrency.symbol || "Native Token"
                        : balance.symbol ||
                          shortenIfAddress(balance.token_address)}
                    </StatLabel>
                    <StatNumber>
                      <Text size="body.md">{balance.display_balance}</Text>
                    </StatNumber>
                    {shareOfBalancesForConnectedWallet[
                      balance.token_address
                    ] && (
                      <StatNumber>
                        <Text size="body.md">
                          <Text as="span" size="label.md">
                            Your Share:
                          </Text>{" "}
                          {
                            shareOfBalancesForConnectedWallet[
                              balance.token_address
                            ]
                          }
                        </Text>
                      </StatNumber>
                    )}
                  </Card>
                ))
            )}
          </SimpleGrid>
          {balanceQuery.isError && (
            <Text color="red.500">
              {(balanceQuery?.error as any).message === "Invalid chain!"
                ? "Showing ERC20 balances for this network is not currently supported. You can distribute ERC20 funds from the Explorer tab."
                : "Error loading balances"}
            </Text>
          )}
          <Text fontStyle="italic">
            The Split can receive funds in the native token or in any ERC20.
            Balances may take a couple of minutes to display after being
            received.
          </Text>
        </Flex>

        <Stack>
          <Heading size="label.lg" mb="8px">
            Split Recipients
          </Heading>
          {splitQuery.data?.map((split) => (
            <Card key={split.address}>
              <Text>
                <Text as="span" size="label.md">
                  Address:
                </Text>{" "}
                {split.address}
              </Text>
              <Text>
                <Text as="span" size="label.md">
                  Percentage:
                </Text>{" "}
                {split.splitPercentage}%
              </Text>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Flex>
  );
};
