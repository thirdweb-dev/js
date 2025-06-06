"use client";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { SkeletonContainer } from "@/components/ui/skeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  DateRangeSelector,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import {
  type AnalyticsQueryParams,
  type TotalQueryResult,
  useContractEventAnalytics,
  useContractEventBreakdown,
  useContractFunctionBreakdown,
  useContractTransactionAnalytics,
  useContractUniqueWalletAnalytics,
  useTotalContractEvents,
  useTotalContractTransactionAnalytics,
  useTotalContractUniqueWallets,
} from "data/analytics/hooks";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";

interface ContractAnalyticsPageProps {
  contract: ThirdwebContract;
  writeFnSelectorToNameRecord: Record<string, string>;
  eventSelectorToNameRecord: Record<string, string>;
}

export const ContractAnalyticsPage: React.FC<ContractAnalyticsPageProps> = ({
  contract,
  writeFnSelectorToNameRecord,
  eventSelectorToNameRecord,
}) => {
  const [range, setRange] = useState<Range>(() => getLastNDaysRange("last-30"));

  return (
    <div>
      <h2 className="mb-3 font-semibold text-xl tracking-tight lg:text-2xl">
        Analytics
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AnalyticsStat
          chainId={contract.chain.id}
          contractAddress={contract.address}
          // FIXME
          // eslint-disable-next-line react-compiler/react-compiler
          useTotal={useTotalContractUniqueWallets}
          label="Unique Wallets"
        />
        <AnalyticsStat
          chainId={contract.chain.id}
          contractAddress={contract.address}
          // FIXME
          // eslint-disable-next-line react-compiler/react-compiler
          useTotal={useTotalContractTransactionAnalytics}
          label="Total Transactions"
        />
        <AnalyticsStat
          chainId={contract.chain.id}
          contractAddress={contract.address}
          // FIXME
          // eslint-disable-next-line react-compiler/react-compiler
          useTotal={useTotalContractEvents}
          label="Total Events"
        />
      </div>

      <div className="mt-8 mb-4">
        <DateRangeSelector range={range} setRange={setRange} />
      </div>

      <div className="flex flex-col gap-6">
        <UniqueWalletsChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          startDate={range.from}
          endDate={range.to}
        />

        <TotalTransactionsChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          startDate={range.from}
          endDate={range.to}
        />

        <TotalEventsChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          startDate={range.from}
          endDate={range.to}
        />

        <FunctionBreakdownChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          startDate={range.from}
          endDate={range.to}
          writeFnSelectorToNameRecord={writeFnSelectorToNameRecord}
        />

        <EventBreakdownChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          startDate={range.from}
          endDate={range.to}
          eventSelectorToNameRecord={eventSelectorToNameRecord}
        />
      </div>
    </div>
  );
};

type ChartProps = {
  contractAddress: string;
  chainId: number;
  startDate: Date;
  endDate: Date;
};

function toolTipLabelFormatter(_v: string, item: unknown) {
  if (Array.isArray(item)) {
    const time = item[0].payload.time as number;
    return format(new Date(time), "MMM d, yyyy");
  }
  return undefined;
}

function UniqueWalletsChart(props: ChartProps) {
  const analyticsQuery = useContractUniqueWalletAnalytics(props);

  return (
    <ThirdwebBarChart
      header={{
        title: "Unique Wallets",
        titleClassName: "mb-0.5 text-xl",
        description:
          "The number of unique wallet addresses that have sent a transaction to this contract.",
      }}
      data={analyticsQuery.data || []}
      isPending={analyticsQuery.isPending}
      config={{
        count: {
          label: "Unique Wallets",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      hideLabel={false}
      toolTipLabelFormatter={toolTipLabelFormatter}
    />
  );
}

function TotalTransactionsChart(props: ChartProps) {
  const analyticsQuery = useContractTransactionAnalytics({
    chainId: props.chainId,
    contractAddress: props.contractAddress,
    endDate: props.endDate,
    startDate: props.startDate,
  });

  return (
    <ThirdwebBarChart
      header={{
        title: "Total Transactions",
        titleClassName: "mb-0.5 text-xl",
        description:
          "The number of transactions that have been sent to this contract.",
      }}
      data={analyticsQuery.data || []}
      isPending={analyticsQuery.isPending}
      config={{
        count: {
          label: "Transactions",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      hideLabel={false}
      toolTipLabelFormatter={toolTipLabelFormatter}
    />
  );
}

function TotalEventsChart(props: ChartProps) {
  const analyticsQuery = useContractEventAnalytics(props);

  return (
    <ThirdwebBarChart
      header={{
        title: "Total Events",
        titleClassName: "mb-0.5 text-xl",
        description:
          "The number of on-chain events that have been emitted from this contract.",
      }}
      data={analyticsQuery.data || []}
      isPending={analyticsQuery.isPending}
      config={{
        count: {
          label: "Events",
          color: "hsl(var(--chart-1))",
        },
      }}
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      hideLabel={false}
      toolTipLabelFormatter={toolTipLabelFormatter}
    />
  );
}

function FunctionBreakdownChart(
  props: ChartProps & {
    writeFnSelectorToNameRecord: Record<string, string>;
  },
) {
  const analyticsQuery = useContractFunctionBreakdown(props);

  // replace function selector with function name
  const mappedQueryData = useMemo(() => {
    return analyticsQuery.data?.map((item) => {
      const modifiedItem = { time: item.time } as typeof item;

      for (const key in item) {
        if (key === "time") {
          continue;
        }

        const name = props.writeFnSelectorToNameRecord[key];
        const value = item[key];
        if (name && value !== undefined) {
          modifiedItem[name] = value;
        }
      }

      return modifiedItem;
    });
  }, [analyticsQuery.data, props.writeFnSelectorToNameRecord]);

  return (
    <ThirdwebBarChart
      header={{
        title: "Function Breakdown",
        titleClassName: "mb-0.5 text-xl",
        description:
          "The breakdown of calls to each write function from transactions.",
      }}
      data={mappedQueryData || []}
      isPending={analyticsQuery.isPending}
      config={Object.keys(mappedQueryData?.[0] || {}).reduce(
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
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      showLegend
      hideLabel={false}
      toolTipLabelFormatter={toolTipLabelFormatter}
    />
  );
}

function EventBreakdownChart(
  props: ChartProps & {
    eventSelectorToNameRecord: Record<string, string>;
  },
) {
  const analyticsQuery = useContractEventBreakdown(props);

  // replace event selector with event name
  const mappedQueryData = useMemo(() => {
    return analyticsQuery.data?.map((item) => {
      const modifiedItem = { time: item.time } as typeof item;

      for (const key in item) {
        if (key === "time") {
          continue;
        }

        const name = props.eventSelectorToNameRecord[key];
        const value = item[key];
        if (name && value !== undefined) {
          modifiedItem[name] = value;
        }
      }

      return modifiedItem;
    });
  }, [analyticsQuery.data, props.eventSelectorToNameRecord]);

  return (
    <ThirdwebBarChart
      header={{
        title: "Event Breakdown",
        titleClassName: "mb-0.5 text-xl",
        description: "The breakdown of events emitted by this contract.",
      }}
      data={mappedQueryData || []}
      isPending={analyticsQuery.isPending}
      config={Object.keys(mappedQueryData?.[0] || {}).reduce(
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
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      showLegend
      hideLabel={false}
      toolTipLabelFormatter={toolTipLabelFormatter}
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
    <AnalyticsData
      chainId={chainId}
      contractAddress={contractAddress}
      useTotal={useTotal}
      label={label}
    />
  );
};

const AnalyticsData: React.FC<AnalyticsStatProps> = ({
  label,
  chainId,
  contractAddress,
  useTotal,
}) => {
  // FIXME: re-work this to not pass the hook down
  // eslint-disable-next-line react-compiler/react-compiler
  const totalQuery = useTotal({
    contractAddress,
    chainId,
  });

  return <AnalyticsStatUI label={label} data={totalQuery.data?.count} />;
};

function AnalyticsStatUI(props: {
  label: string;
  data: number | undefined;
}) {
  return (
    <dl className="rounded-lg border bg-card p-4">
      <dt className="font-semibold">{props.label}</dt>
      <SkeletonContainer
        skeletonData={10000}
        loadedData={props.data}
        render={(v) => {
          return <dd className="font-normal text-xl">{v.toLocaleString()}</dd>;
        }}
      />
    </dl>
  );
}
