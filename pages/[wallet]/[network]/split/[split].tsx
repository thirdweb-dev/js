import {
  useSplitBalances,
  useSplitContractMetadata,
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
import { useAddress, useSplit } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { DistributeButton } from "components/contract-pages/action-buttons/DistributeButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { BigNumber, ethers } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ReactElement, useMemo } from "react";
import { Card, Heading, Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export default function SplitPage() {
  const address = useAddress();
  const splitsAddress = useSingleQueryParam("split");
  const contract = useSplit(splitsAddress);
  const metadata = useSplitContractMetadata(splitsAddress);
  const splitQuery = useSplitData(splitsAddress);
  const balanceQuery = useSplitBalances(splitsAddress);

  const { Track } = useTrack({
    page: "splits",
    splits: splitsAddress,
  });

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

  return (
    <Track>
      <ContractLayout
        contract={contract}
        metadata={metadata}
        data={splitQuery}
        primaryAction={
          <DistributeButton balances={balanceQuery} contract={contract} />
        }
      >
        <Stack spacing={8}>
          <Card as={Flex} gap={4} flexDir="column">
            <Heading size="label.lg" mb="8px">
              Balances
            </Heading>

            {balanceQuery.isLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Stack direction="row">
                {balanceQuery.data?.map((balance) => (
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
                ))}
              </Stack>
            )}
            <Text fontStyle="italic" maxW="lg">
              The Split can receive funds in the native token or in any ERC20.
              Balances may take a couple of minutes to display after being
              received.
            </Text>
          </Card>

          <Card>
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
          </Card>
        </Stack>
      </ContractLayout>
    </Track>
  );
}

SplitPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
