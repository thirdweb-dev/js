import { DistributeButton } from "./components/distribute-button";
import {
  useSplitBalances,
  useSplitData,
} from "@3rdweb-sdk/react/hooks/useSplit";
import {
  Center,
  Flex,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";
import { Card, Heading, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

interface SplitPageProps {
  contractAddress?: string;
}

export const ContractSplitPage: React.FC<SplitPageProps> = ({
  contractAddress,
}) => {
  const address = useAddress();
  const contractQuery = useContract(contractAddress, "split");

  const splitQuery = useSplitData(contractQuery.contract);
  const balanceQuery = useSplitBalances(contractAddress);
  const shareOfBalancesForConnectedWallet = useMemo(() => {
    const activeRecipient = splitQuery.data?.find((r) => r.address === address);
    if (!activeRecipient || !balanceQuery.data) {
      return {};
    }

    return balanceQuery.data.reduce((acc, curr) => {
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
    }, {} as { [address: string]: string });
  }, [splitQuery.data, balanceQuery.data, address]);

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
            balances={balanceQuery}
            contractQuery={contractQuery}
          />
        </Flex>
      </Flex>
      <Stack spacing={8}>
        <Flex gap={4} flexDir="column">
          {balanceQuery.isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Stack direction="row">
              {balanceQuery.isError ? (
                <Text color="red.500">
                  {(balanceQuery?.error as any).message === "Invalid chain!"
                    ? "Showing live balances for this network is not currently supported."
                    : "Error loading balances"}
                </Text>
              ) : (
                (balanceQuery?.data || [])?.map((balance) => (
                  <Card as={Stat} key={balance.token_address} maxWidth="2xs">
                    <StatLabel as={Heading} size="label.lg">
                      {balance.symbol ||
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
            </Stack>
          )}
          <Text fontStyle="italic" maxW="lg">
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
