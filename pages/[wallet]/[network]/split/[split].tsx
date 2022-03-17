import {
  useSplitsBalanceAndDistribute,
  useSplitsContractMetadata,
  useSplitsData,
} from "@3rdweb-sdk/react/hooks/useSplits";
import {
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useAddress, useSplit } from "@thirdweb-dev/react";
import { SplitRecipient } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { DistributeButton } from "components/contract-pages/action-buttons/DistributeButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { Card } from "components/layout/Card";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { ConsolePage } from "pages/_app";

interface IBalance {
  address: string;
  name: string;
  symbol: string;
  balance: string;
}

const SplitsPage: ConsolePage = () => {
  const address = useAddress();
  const splitsAddress = useSingleQueryParam("split");
  const contract = useSplit(splitsAddress);
  const metadata = useSplitsContractMetadata(splitsAddress);
  const { loading, balances, noBalance, distributeFunds, distributeLoading } =
    useSplitsBalanceAndDistribute(splitsAddress);
  const data = useSplitsData(splitsAddress);

  const { Track } = useTrack({
    page: "splits",
    splits: splitsAddress,
  });

  return (
    <Track>
      <ContractLayout
        contract={contract}
        metadata={metadata}
        data={data}
        primaryAction={() => (
          <DistributeButton
            isLoading={distributeLoading}
            distributeFunds={distributeFunds}
          />
        )}
      >
        <Stack spacing={3}>
          {address && (
            <Card>
              <Text size="label.lg" mb="8px">
                Your Balances
              </Text>
              <Text mb="12px">
                This section displays your split of the funds in this contract.
                {!loading &&
                  noBalance &&
                  " There are currently no funds in the contract yet to distribute."}
              </Text>
              {loading ? (
                <Stack align="center">
                  <Spinner mb="12px" />
                </Stack>
              ) : (
                <Stack direction="row">
                  {balances?.map((balance: IBalance) => (
                    <Card as={Stat} key={balance.address} maxWidth="240px">
                      <StatLabel>{balance.symbol}</StatLabel>
                      <StatNumber>{balance.balance}</StatNumber>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>
          )}
          <Card>
            <Stack>
              <Text size="label.lg" mb="8px">
                Split Recipients
              </Text>
              {data?.data?.map((split: SplitRecipient) => (
                <Card key={split.address}>
                  <Text>
                    <strong>Address:</strong> {split.address}
                  </Text>
                  <Text>
                    <strong>Percentage:</strong> {split.splitPercentage}%
                  </Text>
                </Card>
              ))}
            </Stack>
          </Card>
        </Stack>
      </ContractLayout>
    </Track>
  );
};

SplitsPage.Layout = AppLayout;

export default SplitsPage;
