import { useEVMContractInfo } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { UseQueryResult } from "@tanstack/react-query";
import {
  AreaChartProps,
  GenericDataType,
} from "components/analytics/area-chart";
import { AutoBarChart } from "components/analytics/auto-bar-chart";
import { BarChart } from "components/analytics/bar-chart";
import { ChartContainer } from "components/analytics/chart-container";
import {
  AnalyticsQueryParams,
  SUPPORTED_ANALYTICS_CHAINS,
  TotalQueryResult,
  useEventsAnalytics,
  useFunctionsAnalytics,
  useLogsAnalytics,
  useTotalLogsAnalytics,
  useTotalTransactionAnalytics,
  useTotalWalletsAnalytics,
  useTransactionAnalytics,
  useUniqueWalletsAnalytics,
} from "data/analytics/hooks";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Card, Heading, Text } from "tw-components";

interface ContractAnalyticsPageProps {
  contractAddress?: string;
}

export const ContractAnalyticsPage: React.FC<ContractAnalyticsPageProps> = ({
  contractAddress,
}) => {
  const [startDate] = useState(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
  );
  const [endDate] = useState(new Date());

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const evmContractInfo = useEVMContractInfo();

  if (!contractAddress) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      {contractAddress && evmContractInfo?.chain && (
        <>
          <Flex gap={10} direction="column">
            <Flex direction="column" gap={2}>
              <Alert status="info" borderRadius="md" mb={4}>
                <AlertIcon />
                <AlertTitle>Analytics is in beta.</AlertTitle>
                <AlertDescription>
                  Some data may be partially inaccurate or incomplete.
                </AlertDescription>
              </Alert>
              <Heading as="h2" size="title.md">
                Analytics
              </Heading>
              <Flex gap={4}>
                <AnalyticsStat
                  chainId={evmContractInfo.chain.chainId}
                  contractAddress={contractAddress}
                  useTotal={useTotalWalletsAnalytics}
                  label="Unique Wallets"
                />
                <AnalyticsStat
                  chainId={evmContractInfo.chain.chainId}
                  contractAddress={contractAddress}
                  useTotal={useTotalTransactionAnalytics}
                  label="Total Transactions"
                />
                <AnalyticsStat
                  chainId={evmContractInfo.chain.chainId}
                  contractAddress={contractAddress}
                  useTotal={useTotalLogsAnalytics}
                  label="Total Events"
                />
              </Flex>
            </Flex>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap={4}>
            <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
              <Stack spacing={0}>
                <Heading as="h3" size="subtitle.sm">
                  Unique Wallets
                </Heading>
                <Text>
                  The number of unique wallet addresses that have sent a
                  transaction to this contract.
                </Text>
              </Stack>
              <ChartContainer w="full" ratio={4.5 / 1}>
                <AnalyticsChart
                  contractAddress={contractAddress}
                  chainId={evmContractInfo.chain.chainId}
                  startDate={startDate}
                  endDate={endDate}
                  index={"time"}
                  categories={[{ id: "wallets", label: "Unique Wallets" }]}
                  useAnalytics={useUniqueWalletsAnalytics}
                />
              </ChartContainer>
            </Flex>
            <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
              <Stack spacing={0}>
                <Heading as="h3" size="subtitle.sm">
                  Total Transactions
                </Heading>
                <Text>
                  The number of transactions that have been sent to this
                  contract.
                </Text>
              </Stack>
              <ChartContainer w="full" ratio={4.5 / 1}>
                <AnalyticsChart
                  contractAddress={contractAddress}
                  chainId={evmContractInfo.chain.chainId}
                  startDate={startDate}
                  endDate={endDate}
                  index={"time"}
                  categories={[{ id: "count", label: "Transactions" }]}
                  useAnalytics={useTransactionAnalytics}
                />
              </ChartContainer>
            </Flex>

            <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
              <Stack spacing={0}>
                <Heading as="h3" size="subtitle.sm">
                  Total Events
                </Heading>
                <Text>
                  The number of on-chain events that have been emitted from this
                  contract.
                </Text>
              </Stack>
              <ChartContainer w="full" ratio={4.5 / 1}>
                <AnalyticsChart
                  contractAddress={contractAddress}
                  chainId={evmContractInfo.chain.chainId}
                  startDate={startDate}
                  endDate={endDate}
                  index={"time"}
                  categories={[{ id: "count", label: "Events" }]}
                  useAnalytics={useLogsAnalytics}
                />
              </ChartContainer>
            </Flex>
            <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
              <Stack spacing={0}>
                <Heading as="h3" size="subtitle.sm">
                  Function Breakdown
                </Heading>
                <Text>
                  The breakdown of calls to each write function from
                  transactions.
                </Text>
              </Stack>
              <ChartContainer w="full" ratio={4.5 / 1}>
                <AnalyticsChart
                  contractAddress={contractAddress}
                  chainId={evmContractInfo.chain.chainId}
                  startDate={startDate}
                  endDate={endDate}
                  index={"time"}
                  categories={"auto"}
                  useAnalytics={useFunctionsAnalytics}
                />
              </ChartContainer>
            </Flex>
            <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
              <Stack spacing={0}>
                <Heading as="h3" size="subtitle.sm">
                  Event Breakdown
                </Heading>
                <Text>The breakdown of events emitted by this contract.</Text>
              </Stack>
              <ChartContainer w="full" ratio={4.5 / 1}>
                <AnalyticsChart
                  contractAddress={contractAddress}
                  chainId={evmContractInfo.chain.chainId}
                  startDate={startDate}
                  endDate={endDate}
                  index={"time"}
                  categories={"auto"}
                  useAnalytics={useEventsAnalytics}
                />
              </ChartContainer>
            </Flex>
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};

interface AnalyticsChartProps<
  TAnalytics extends GenericDataType = GenericDataType,
> {
  chainId: number;
  contractAddress: string;
  startDate: Date;
  endDate: Date;
  index: string;
  categories: AreaChartProps<TAnalytics, "time">["categories"] | "auto";
  useAnalytics: (params: AnalyticsQueryParams) => UseQueryResult<TAnalytics[]>;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  chainId,
  contractAddress,
  startDate,
  endDate,
  index,
  categories,
  useAnalytics,
  showXAxis,
  showYAxis,
}) => {
  const analyticsQuery = useAnalytics({
    contractAddress,
    chainId,
    startDate,
    endDate,
  });

  const data = useMemo(() => {
    if (!analyticsQuery.data) {
      return [];
    }

    return analyticsQuery.data;
  }, [analyticsQuery.data]);

  if (data.length <= 1) {
    return (
      <Alert status="info" borderRadius="md" mb={4}>
        <AlertIcon />
        {SUPPORTED_ANALYTICS_CHAINS.includes(chainId) ? (
          <AlertDescription>No recent activity.</AlertDescription>
        ) : (
          <AlertDescription>
            Analytics for this chain not currently supported.
          </AlertDescription>
        )}
      </Alert>
    );
  }

  if (categories === "auto") {
    return (
      <AutoBarChart
        data={data}
        index={{ id: index }}
        showXAxis
        showYAxis
        stacked
      />
    );
  }

  return (
    <BarChart
      data={data}
      index={{ id: index }}
      categories={categories}
      showXAxis={showXAxis !== undefined ? showXAxis : true}
      showYAxis={showYAxis !== undefined ? showYAxis : true}
    />
  );
};

interface AnalyticsStatProps {
  label: string;
  chainId: number;
  contractAddress: string;
  useTotal: (params: AnalyticsQueryParams) => UseQueryResult<TotalQueryResult>;
}

const AnalyticsStat: React.FC<AnalyticsStatProps> = ({
  label,
  chainId,
  contractAddress,
  useTotal,
}) => {
  return (
    <Suspense fallback={<AnalyticsSkeleton label={label} />}>
      <AnalyticsData
        chainId={chainId}
        contractAddress={contractAddress}
        useTotal={useTotal}
        label={label}
      />
    </Suspense>
  );
};

const AnalyticsSkeleton: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>{label}</StatLabel>
      <Skeleton isLoaded={false}>
        <StatNumber>{0}</StatNumber>
      </Skeleton>
    </Card>
  );
};

const AnalyticsData: React.FC<AnalyticsStatProps> = ({
  label,
  chainId,
  contractAddress,
  useTotal,
}) => {
  const totalQuery = useTotal({
    contractAddress,
    chainId,
  });

  const data = useMemo(() => {
    if (!totalQuery.data) {
      return 0;
    }

    return totalQuery.data.count;
  }, [totalQuery.data]);

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>{label}</StatLabel>
      <Skeleton isLoaded={totalQuery.isFetched}>
        <StatNumber>{data.toLocaleString()}</StatNumber>
      </Skeleton>
    </Card>
  );
};
