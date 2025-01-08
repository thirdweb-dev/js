"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useSplitBalances } from "@3rdweb-sdk/react/hooks/useSplit";
import {
  Flex,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useAllChainsData } from "hooks/chains/allChains";
import { useMemo } from "react";
import {
  type ThirdwebContract,
  ZERO_ADDRESS,
  toEther,
  toTokens,
} from "thirdweb";
import { getAllRecipientsPercentages } from "thirdweb/extensions/split";
import {
  useActiveAccount,
  useReadContract,
  useWalletBalance,
} from "thirdweb/react";
import { Card, Heading, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { DistributeButton } from "./components/distribute-button";

export type Balance = {
  name: string;
  token_address: string;
  balance: string;
  display_balance: string;
  decimals: number;
};

interface SplitPageProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const ContractSplitPage: React.FC<SplitPageProps> = ({
  contract,
  twAccount,
}) => {
  const address = useActiveAccount()?.address;
  const { idToChain } = useAllChainsData();
  const chainId = contract.chain.id;
  const v4Chain = idToChain.get(chainId);
  const contractAddress = contract.address;
  const nativeBalanceQuery = useWalletBalance({
    address: contractAddress,
    client: contract.client,
    chain: contract.chain,
  });
  const { data: allRecipientsPercentages } = useReadContract(
    getAllRecipientsPercentages,
    { contract },
  );
  const balanceQuery = useSplitBalances(contract);
  const balances = useMemo(() => {
    if (!balanceQuery.data && !nativeBalanceQuery.data) {
      return [];
    }

    return [
      {
        name: "Native Token",
        token_address: ZERO_ADDRESS,
        balance: nativeBalanceQuery?.data?.value?.toString() || "0",
        display_balance: nativeBalanceQuery?.data?.displayValue || "0.0",
        decimals: nativeBalanceQuery?.data?.decimals || 18,
      },
      ...(balanceQuery.data || []).filter((bl) => bl.name !== "Native Token"),
    ];
  }, [balanceQuery.data, nativeBalanceQuery.data]);

  const shareOfBalancesForConnectedWallet = useMemo(() => {
    const activeRecipient = (allRecipientsPercentages || []).find(
      (r) => r.address.toLowerCase() === address?.toLowerCase(),
    );
    if (!activeRecipient || !balances) {
      return {};
    }

    return balances.reduce(
      (acc, curr) => {
        // For native token balance, Moralis returns the zero address
        // this logic will potentially have to change if we decide to replace the service
        const isNativeToken = curr.token_address === ZERO_ADDRESS;
        const displayBalance = isNativeToken
          ? toEther(BigInt(curr.balance))
          : toTokens(BigInt(curr.balance), curr.decimals);
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: FIXME
          ...acc,
          [curr.token_address]: displayBalance,
        };
      },
      {} as { [address: string]: string },
    );
  }, [allRecipientsPercentages, balances, address]);

  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Balances</Heading>
        <Flex gap={4}>
          <DistributeButton
            balances={balances as Balance[]}
            balancesIsPending={
              balanceQuery.isPending || nativeBalanceQuery.isPending
            }
            balancesIsError={balanceQuery.isError && nativeBalanceQuery.isError}
            contract={contract}
            twAccount={twAccount}
          />
        </Flex>
      </Flex>
      <div className="flex flex-col gap-8">
        <Flex gap={4} flexDir="column">
          <SimpleGrid spacing={{ base: 3, md: 6 }} columns={{ base: 2, md: 4 }}>
            <Card as={Stat}>
              <StatLabel mb={{ base: 1, md: 0 }}>
                {nativeBalanceQuery.data?.symbol}
              </StatLabel>
              <StatNumber>{nativeBalanceQuery?.data?.displayValue}</StatNumber>
              {shareOfBalancesForConnectedWallet[ZERO_ADDRESS] && (
                <StatNumber>
                  <Text size="body.md">
                    <Text as="span" size="label.md">
                      Your Share:
                    </Text>{" "}
                    {shareOfBalancesForConnectedWallet[ZERO_ADDRESS]}
                  </Text>
                </StatNumber>
              )}
            </Card>
            {balanceQuery.isPending ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              (balanceQuery?.data || [])
                ?.filter((bl) => bl.name !== "Native Token")
                ?.map((balance) => (
                  <Card as={Stat} key={balance.token_address} maxWidth="2xs">
                    <StatLabel as={Heading} size="label.lg">
                      {balance.name === "Native Token"
                        ? v4Chain?.nativeCurrency.symbol || "Native Token"
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
              {(balanceQuery?.error as Error).message === "Invalid chain!"
                ? "Showing ERC20 balances for this network is not currently supported. You can distribute ERC20 funds from the Explorer tab."
                : "Error loading balances"}
            </Text>
          )}
          <Text fontStyle="italic">
            The Split can receive funds in the native token or in any ERC20.
            Balances may take a couple of minutes to display after being
            received.
            <br />
            {/* We currently use Moralis and high chances are they don't recognize all ERC20 tokens in the contract */}
            If you are looking to distribute an ERC20 token and it's not being
            recognized on this page, you can manually call the `distribute`
            method in the Explorer page
          </Text>
        </Flex>

        <div className="flex flex-col gap-2">
          <Heading size="label.lg" mb="8px">
            Split Recipients
          </Heading>
          {(allRecipientsPercentages || []).map((split) => (
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
        </div>
      </div>
    </Flex>
  );
};
