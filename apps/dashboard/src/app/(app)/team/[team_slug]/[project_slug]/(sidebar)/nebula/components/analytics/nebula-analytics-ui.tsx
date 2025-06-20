"use client";

import { format } from "date-fns";
import {
  ActivityIcon,
  MessageCircleQuestionIcon,
  MessageSquareIcon,
  MessageSquareQuoteIcon,
} from "lucide-react";
import { useMemo } from "react";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { SkeletonContainer } from "@/components/ui/skeleton";
import type { NebulaAnalyticsDataItem } from "./fetch-nebula-analytics";

type ChartData = {
  time: Date;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalSessions: number;
  totalRequests: number;
};

type AnalyticsChartProps = {
  data: ChartData[];
  isPending: boolean;
  title: string;
  description: string;
  dataKey: keyof ChartData;
  color: string;
};

function AnalyticsChart({
  data,
  isPending,
  title,
  description,
  dataKey,
  color,
}: AnalyticsChartProps) {
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[2.5]"
      config={{
        [dataKey]: {
          color,
          label: title,
        },
      }}
      data={data.map((item) => ({
        ...item,
        time: item.time.getTime(),
      }))}
      header={{
        description,
        title,
        titleClassName: "text-xl mb-1",
      }}
      hideLabel={false}
      isPending={isPending}
      toolTipLabelFormatter={toolTipLabelFormatter}
    />
  );
}

export function NebulaAnalyticsDashboardUI(props: {
  data: NebulaAnalyticsDataItem[];
  isPending: boolean;
}) {
  const data = useMemo(() => {
    const val: {
      totalPromptTokens: number;
      totalCompletionTokens: number;
      totalSessions: number;
      totalRequests: number;
      chartData: ChartData[];
    } = {
      chartData: [],
      totalCompletionTokens: 0,
      totalPromptTokens: 0,
      totalRequests: 0,
      totalSessions: 0,
    };

    for (const item of props.data) {
      val.totalPromptTokens += item.totalPromptTokens;
      val.totalCompletionTokens += item.totalCompletionTokens;
      val.totalSessions += item.totalSessions;
      val.totalRequests += item.totalRequests;
      val.chartData.push({
        time: new Date(item.date),
        totalCompletionTokens: item.totalCompletionTokens,
        totalPromptTokens: item.totalPromptTokens,
        totalRequests: item.totalRequests,
        totalSessions: item.totalSessions,
      });
    }

    return val;
  }, [props.data]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ActivityIcon}
          isPending={props.isPending}
          title="User Prompts"
          value={data.totalRequests}
        />
        <StatCard
          icon={MessageSquareIcon}
          isPending={props.isPending}
          title="Sessions Created"
          value={data.totalSessions}
        />
        <StatCard
          icon={MessageCircleQuestionIcon}
          isPending={props.isPending}
          title="Prompt Tokens"
          value={data.totalPromptTokens}
        />
        <StatCard
          icon={MessageSquareQuoteIcon}
          isPending={props.isPending}
          title="Response Tokens"
          value={data.totalCompletionTokens}
        />
      </div>

      <div className="h-4" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AnalyticsChart
          color="hsl(var(--chart-1))"
          data={data.chartData}
          dataKey="totalRequests"
          description="Total user-generated prompts"
          isPending={props.isPending}
          title="Prompts"
        />

        <AnalyticsChart
          color="hsl(var(--chart-3))"
          data={data.chartData}
          dataKey="totalSessions"
          description="Total chat sessions created by users"
          isPending={props.isPending}
          title="Sessions Created"
        />

        <AnalyticsChart
          color="hsl(var(--chart-2))"
          data={data.chartData}
          dataKey="totalPromptTokens"
          description="Total tokens sent in prompts"
          isPending={props.isPending}
          title="Prompt Tokens"
        />

        <AnalyticsChart
          color="hsl(var(--chart-5))"
          data={data.chartData}
          dataKey="totalCompletionTokens"
          description="Total tokens sent in responses"
          isPending={props.isPending}
          title="Response Tokens"
        />
      </div>
    </div>
  );
}

function toolTipLabelFormatter(_v: string, item: unknown) {
  if (Array.isArray(item)) {
    const time = item[0].payload.time as number;
    return format(new Date(time), "MMM d, yyyy");
  }
  return undefined;
}

function StatCard(props: {
  title: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  isPending: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm lg:text-base">{props.title}</h2>
        <props.icon className="size-4 text-muted-foreground" />
      </div>
      <SkeletonContainer
        className="inline-block"
        loadedData={props.isPending ? undefined : props.value}
        render={(v) => (
          <p className="font-semibold text-2xl tracking-tight">{v}</p>
        )}
        skeletonData={10000}
      />
    </div>
  );
}
