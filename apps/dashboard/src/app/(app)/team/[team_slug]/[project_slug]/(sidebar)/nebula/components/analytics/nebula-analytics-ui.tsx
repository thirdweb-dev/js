"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  ActivityIcon,
  MessageCircleQuestionIcon,
  MessageSquareIcon,
  MessageSquareQuoteIcon,
} from "lucide-react";
import { useMemo } from "react";
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
      data={data.map((item) => ({
        ...item,
        time: item.time.getTime(),
      }))}
      isPending={isPending}
      header={{
        title,
        description,
        titleClassName: "text-xl mb-1",
      }}
      chartClassName="aspect-[1.5] lg:aspect-[2.5]"
      hideLabel={false}
      toolTipLabelFormatter={toolTipLabelFormatter}
      config={{
        [dataKey]: {
          label: title,
          color,
        },
      }}
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
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalSessions: 0,
      totalRequests: 0,
      chartData: [],
    };

    for (const item of props.data) {
      val.totalPromptTokens += item.totalPromptTokens;
      val.totalCompletionTokens += item.totalCompletionTokens;
      val.totalSessions += item.totalSessions;
      val.totalRequests += item.totalRequests;
      val.chartData.push({
        totalPromptTokens: item.totalPromptTokens,
        totalCompletionTokens: item.totalCompletionTokens,
        totalSessions: item.totalSessions,
        totalRequests: item.totalRequests,
        time: new Date(item.date),
      });
    }

    return val;
  }, [props.data]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="User Prompts"
          value={data.totalRequests}
          icon={ActivityIcon}
          isPending={props.isPending}
        />
        <StatCard
          title="Sessions Created"
          value={data.totalSessions}
          icon={MessageSquareIcon}
          isPending={props.isPending}
        />
        <StatCard
          title="Prompt Tokens"
          value={data.totalPromptTokens}
          icon={MessageCircleQuestionIcon}
          isPending={props.isPending}
        />
        <StatCard
          title="Response Tokens"
          value={data.totalCompletionTokens}
          icon={MessageSquareQuoteIcon}
          isPending={props.isPending}
        />
      </div>

      <div className="h-4" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AnalyticsChart
          data={data.chartData}
          isPending={props.isPending}
          title="Prompts"
          description="Total user-generated prompts"
          dataKey="totalRequests"
          color="hsl(var(--chart-1))"
        />

        <AnalyticsChart
          data={data.chartData}
          isPending={props.isPending}
          title="Sessions Created"
          description="Total chat sessions created by users"
          dataKey="totalSessions"
          color="hsl(var(--chart-3))"
        />

        <AnalyticsChart
          data={data.chartData}
          isPending={props.isPending}
          title="Prompt Tokens"
          description="Total tokens sent in prompts"
          dataKey="totalPromptTokens"
          color="hsl(var(--chart-2))"
        />

        <AnalyticsChart
          data={data.chartData}
          isPending={props.isPending}
          title="Response Tokens"
          description="Total tokens sent in responses"
          dataKey="totalCompletionTokens"
          color="hsl(var(--chart-5))"
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
        skeletonData={10000}
        loadedData={props.isPending ? undefined : props.value}
        render={(v) => (
          <p className="font-semibold text-2xl tracking-tight">{v}</p>
        )}
      />
    </div>
  );
}
