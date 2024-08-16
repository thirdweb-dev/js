"use client";

import { useEVMContractInfo } from "@3rdweb-sdk/react/hooks/useActiveChainId";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  type AnalyticsQueryParams,
  type TotalQueryResult,
  useAnalyticsSupportedForChain,
  useEventsAnalytics,
  useFunctionsAnalytics,
  useLogsAnalytics,
  useTotalLogsAnalytics,
  useTotalTransactionAnalytics,
  useTotalWalletsAnalytics,
  useTransactionAnalytics,
  useUniqueWalletsAnalytics,
} from "data/analytics/hooks";
import { Suspense, useMemo, useState } from "react";
import { Card, Heading } from "tw-components";
import { ThirdwebBarChart } from "../../../@/components/blocks/charts/bar-chart";
import { useIsomorphicLayoutEffect } from "../../../@/lib/useIsomorphicLayoutEffect";

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

  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const evmContractInfo = useEVMContractInfo();

  const analyticsSupported = useAnalyticsSupportedForChain(
    evmContractInfo?.chain?.chainId,
  );

  if (
    !contractAddress ||
    !evmContractInfo?.chain?.chainId ||
    analyticsSupported.isLoading
  ) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!analyticsSupported.data) {
    return (
      <Alert status="warning" borderRadius="md" mb={4}>
        <AlertIcon />
        <AlertTitle>Analytics is not supported for this chain.</AlertTitle>
        <AlertDescription>
          Analytics support is rolling out to additional chains. Please check
          back later.
        </AlertDescription>
      </Alert>
    );
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
                  // FIXME
                  // eslint-disable-next-line react-compiler/react-compiler
                  useTotal={useTotalWalletsAnalytics}
                  label="Unique Wallets"
                />
                <AnalyticsStat
                  chainId={evmContractInfo.chain.chainId}
                  contractAddress={contractAddress}
                  // FIXME
                  // eslint-disable-next-line react-compiler/react-compiler
                  useTotal={useTotalTransactionAnalytics}
                  label="Total Transactions"
                />
                <AnalyticsStat
                  chainId={evmContractInfo.chain.chainId}
                  contractAddress={contractAddress}
                  // FIXME
                  // eslint-disable-next-line react-compiler/react-compiler
                  useTotal={useTotalLogsAnalytics}
                  label="Total Events"
                />
              </Flex>
            </Flex>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap={4}>
            <UniqueWalletsChart
              chainId={evmContractInfo.chain.chainId}
              contractAddress={contractAddress}
              startDate={startDate}
              endDate={endDate}
            />

            <TotalTransactionsChart
              chainId={evmContractInfo.chain.chainId}
              contractAddress={contractAddress}
              startDate={startDate}
              endDate={endDate}
            />

            <TotalEventsChart
              chainId={evmContractInfo.chain.chainId}
              contractAddress={contractAddress}
              startDate={startDate}
              endDate={endDate}
            />

            <FunctionBreakdownChart
              chainId={evmContractInfo.chain.chainId}
              contractAddress={contractAddress}
              startDate={startDate}
              endDate={endDate}
            />

            <EventBreakdownChart
              chainId={evmContractInfo.chain.chainId}
              contractAddress={contractAddress}
              startDate={startDate}
              endDate={endDate}
            />
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};

type ChartProps = {
  contractAddress: string;
  chainId: number;
  startDate: Date;
  endDate: Date;
};
function UniqueWalletsChart(props: ChartProps) {
  const { data } = useUniqueWalletsAnalytics(props);

  return (
    <ThirdwebBarChart
      title="Unique Wallets"
      description="The number of unique wallet addresses that have sent a transaction to this contract."
      data={data || []}
      config={{
        wallets: {
          label: "Unique Wallets",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect[2] lg:aspect-[4.5]"
    />
  );
}

function TotalTransactionsChart(props: ChartProps) {
  const { data } = useTransactionAnalytics({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    endDate: props.endDate,
    startDate: props.startDate,
  });

  return (
    <ThirdwebBarChart
      title="Total Transactions"
      description="The number of transactions that have been sent to this contract."
      data={data || []}
      config={{
        count: {
          label: "Transactions",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect[2] lg:aspect-[4.5]"
    />
  );
}

function TotalEventsChart(props: ChartProps) {
  const { data } = useLogsAnalytics(props);

  return (
    <ThirdwebBarChart
      title="Total Events"
      description="The number of on-chain events that have been emitted from this contract."
      data={data || []}
      config={{
        count: {
          label: "Events",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect[2] lg:aspect-[4.5]"
    />
  );
}

function FunctionBreakdownChart(props: ChartProps) {
  const { data } = useFunctionsAnalytics(props);

  return (
    <ThirdwebBarChart
      title="Function Breakdown"
      description="The breakdown of calls to each write function from transactions."
      data={data || []}
      config={Object.keys(data?.[0] || {}).reduce(
        (acc, key) => {
          if (key === "time") {
            return acc;
          }
          acc[key] = {
            label: key,
            color: `hsl(var(--chart-${(Object.keys(acc).length % 15) + 1}))`,
          };
          return acc;
        },
        {} as Record<string, { label: string; color: string }>,
      )}
      chartClassName="aspect[2] lg:aspect-[4.5]"
      showLegend
    />
  );
}

function EventBreakdownChart(props: ChartProps) {
  const { data } = useEventsAnalytics(props);

  return (
    <ThirdwebBarChart
      title="Event Breakdown"
      description="The breakdown of events emitted by this contract."
      data={data || []}
      config={Object.keys(data?.[0] || {}).reduce(
        (acc, key) => {
          if (key === "time") {
            return acc;
          }
          acc[key] = {
            label: key,
            color: `hsl(var(--chart-${(Object.keys(acc).length % 15) + 1}))`,
          };
          return acc;
        },
        {} as Record<string, { label: string; color: string }>,
      )}
      chartClassName="aspect[2] lg:aspect-[4.5]"
      showLegend
    />
  );
}

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
