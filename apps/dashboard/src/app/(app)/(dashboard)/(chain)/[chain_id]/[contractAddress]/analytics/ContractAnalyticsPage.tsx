"use client";
import type { UseQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import {
  DateRangeSelector,
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/search";
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
} from "./utils/hooks";

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
          label="Unique Wallets"
          // FIXME
          // eslint-disable-next-line react-compiler/react-compiler
          useTotal={useTotalContractUniqueWallets}
        />
        <AnalyticsStat
          chainId={contract.chain.id}
          contractAddress={contract.address}
          label="Total Transactions"
          // FIXME
          // eslint-disable-next-line react-compiler/react-compiler
          useTotal={useTotalContractTransactionAnalytics}
        />
        <AnalyticsStat
          chainId={contract.chain.id}
          contractAddress={contract.address}
          label="Total Events"
          // FIXME
          // eslint-disable-next-line react-compiler/react-compiler
          useTotal={useTotalContractEvents}
        />
      </div>

      <div className="mt-8 mb-4">
        <DateRangeSelector range={range} setRange={setRange} />
      </div>

      <div className="flex flex-col gap-6">
        <UniqueWalletsChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          endDate={range.to}
          startDate={range.from}
        />

        <TotalTransactionsChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          endDate={range.to}
          startDate={range.from}
        />

        <TotalEventsChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          endDate={range.to}
          startDate={range.from}
        />

        <FunctionBreakdownChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          endDate={range.to}
          startDate={range.from}
          writeFnSelectorToNameRecord={writeFnSelectorToNameRecord}
        />

        <EventBreakdownChart
          chainId={contract.chain.id}
          contractAddress={contract.address}
          endDate={range.to}
          eventSelectorToNameRecord={eventSelectorToNameRecord}
          startDate={range.from}
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
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      config={{
        count: {
          color: "hsl(var(--chart-1))",
          label: "Unique Wallets",
        },
      }}
      data={analyticsQuery.data || []}
      header={{
        description:
          "The number of unique wallet addresses that have sent a transaction to this contract.",
        title: "Unique Wallets",
        titleClassName: "mb-0.5 text-xl",
      }}
      hideLabel={false}
      isPending={analyticsQuery.isPending}
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
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      config={{
        count: {
          color: "hsl(var(--chart-1))",
          label: "Transactions",
        },
      }}
      data={analyticsQuery.data || []}
      header={{
        description:
          "The number of transactions that have been sent to this contract.",
        title: "Total Transactions",
        titleClassName: "mb-0.5 text-xl",
      }}
      hideLabel={false}
      isPending={analyticsQuery.isPending}
      toolTipLabelFormatter={toolTipLabelFormatter}
    />
  );
}

function TotalEventsChart(props: ChartProps) {
  const analyticsQuery = useContractEventAnalytics(props);

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      config={{
        count: {
          color: "hsl(var(--chart-1))",
          label: "Events",
        },
      }}
      data={analyticsQuery.data || []}
      header={{
        description:
          "The number of on-chain events that have been emitted from this contract.",
        title: "Total Events",
        titleClassName: "mb-0.5 text-xl",
      }}
      hideLabel={false}
      isPending={analyticsQuery.isPending}
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
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      config={Object.keys(mappedQueryData?.[0] || {}).reduce(
        (acc, key) => {
          if (key === "time") {
            return acc;
          }
          acc[key] = {
            color: `hsl(var(--chart-${(Object.keys(acc).length % 15) + 1}))`,
            label: key,
          };
          return acc;
        },
        {} as Record<string, { label: string; color: string }>,
      )}
      data={mappedQueryData || []}
      header={{
        description:
          "The breakdown of calls to each write function from transactions.",
        title: "Function Breakdown",
        titleClassName: "mb-0.5 text-xl",
      }}
      hideLabel={false}
      isPending={analyticsQuery.isPending}
      showLegend
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
      chartClassName="aspect-[1.5] lg:aspect-[4.5]"
      config={Object.keys(mappedQueryData?.[0] || {}).reduce(
        (acc, key) => {
          if (key === "time") {
            return acc;
          }
          acc[key] = {
            color: `hsl(var(--chart-${(Object.keys(acc).length % 15) + 1}))`,
            label: key,
          };
          return acc;
        },
        {} as Record<string, { label: string; color: string }>,
      )}
      data={mappedQueryData || []}
      header={{
        description: "The breakdown of events emitted by this contract.",
        title: "Event Breakdown",
        titleClassName: "mb-0.5 text-xl",
      }}
      hideLabel={false}
      isPending={analyticsQuery.isPending}
      showLegend
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
      label={label}
      useTotal={useTotal}
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
    chainId,
    contractAddress,
  });

  return <AnalyticsStatUI data={totalQuery.data?.count} label={label} />;
};

function AnalyticsStatUI(props: { label: string; data: number | undefined }) {
  return (
    <dl className="rounded-lg border bg-card p-4">
      <dt className="font-semibold">{props.label}</dt>
      <SkeletonContainer
        loadedData={props.data}
        render={(v) => {
          return <dd className="font-normal text-xl">{formatNumber(v)}</dd>;
        }}
        skeletonData={10000}
      />
    </dl>
  );
}
