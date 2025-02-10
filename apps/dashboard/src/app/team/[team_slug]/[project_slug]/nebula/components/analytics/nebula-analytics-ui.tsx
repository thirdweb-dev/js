import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { SkeletonContainer } from "@/components/ui/skeleton";
import {
  ActivityIcon,
  MessageCircleQuestionIcon,
  MessageSquareIcon,
  MessageSquareQuoteIcon,
} from "lucide-react";
import { useMemo } from "react";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { normalizeTimeISOString } from "../../../../../../../lib/time";
import {
  type NebulaAnalyticsDataItem,
  fetchNebulaAnalytics,
} from "./fetch-nebula-analytics";
import { NebulaAnalyticsFilter } from "./nebula-analytics-filter";
import { getNebulaAnalyticsRangeFromSearchParams } from "./utils";

type ChartData = {
  time: Date;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalSessions: number;
  totalRequests: number;
};

export function NebulaAnalyticsPage(props: {
  searchParams: {
    from: string | undefined | string[];
    to: string | undefined | string[];
    interval: string | undefined | string[];
  };
  accountId: string;
  authToken: string;
}) {
  return (
    <ResponsiveSearchParamsProvider value={props.searchParams}>
      <header className="border-b">
        <div className="container flex flex-col items-start gap-3 py-10 md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
              Nebula
            </h1>
          </div>
          <NebulaAnalyticsFilter />
        </div>
      </header>

      <div className="container pt-8 pb-20">
        <ResponsiveSuspense
          searchParamsUsed={["from", "to", "interval"]}
          fallback={<NebulaAnalyticsDashboardUI data={[]} isPending={true} />}
        >
          <NebulaAnalyticDashboard
            searchParams={props.searchParams}
            accountId={props.accountId}
            authToken={props.authToken}
          />
        </ResponsiveSuspense>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}

async function NebulaAnalyticDashboard(props: {
  accountId: string;
  authToken: string;
  searchParams: {
    from: string | undefined | string[];
    to: string | undefined | string[];
    interval: string | undefined | string[];
  };
}) {
  const { range, interval } = getNebulaAnalyticsRangeFromSearchParams(
    props.searchParams,
  );

  const res = await fetchNebulaAnalytics({
    accountId: props.accountId,
    authToken: props.authToken,
    from: normalizeTimeISOString(range.from),
    to: normalizeTimeISOString(range.to),
    interval,
  });

  if (!res.ok) {
    return (
      <div className="flex min-h-[300px] grow items-center justify-center rounded-lg border">
        <div>
          <p className="mb-2 text-center text-destructive-text">
            Failed to fetch Nebula analytics
          </p>
          <p className="text-muted-foreground">{res.error}</p>
        </div>
      </div>
    );
  }

  return <NebulaAnalyticsDashboardUI data={res.data} isPending={false} />;
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
          title="Requests sent"
          value={data.totalRequests}
          icon={ActivityIcon}
          isPending={props.isPending}
        />
        <StatCard
          title="Sessions created"
          value={data.totalSessions}
          icon={MessageSquareIcon}
          isPending={props.isPending}
        />
        <StatCard
          title="Prompt tokens received"
          value={data.totalPromptTokens}
          icon={MessageCircleQuestionIcon}
          isPending={props.isPending}
        />
        <StatCard
          title="Response tokens sent"
          value={data.totalCompletionTokens}
          icon={MessageSquareQuoteIcon}
          isPending={props.isPending}
        />
      </div>

      <div className="h-8" />

      <div className="flex flex-col gap-8">
        <ThirdwebBarChart
          data={data.chartData}
          isPending={props.isPending}
          title="Requests sent"
          description="Total number of requests sent to the Nebula from users"
          chartClassName="aspect-[1.5] lg:aspect-[4.5]"
          config={{
            totalRequests: {
              label: "Total requests",
              color: "hsl(var(--chart-1))",
            },
          }}
        />

        <ThirdwebBarChart
          data={data.chartData}
          isPending={props.isPending}
          title="Sessions created"
          description="Total chat sessions created by users. A session is a conversation thread between a user and the Nebula"
          chartClassName="aspect-[1.5] lg:aspect-[4.5]"
          config={{
            totalSessions: {
              label: "Total sessions",
              color: "hsl(var(--chart-3))",
            },
          }}
        />

        <ThirdwebBarChart
          data={data.chartData}
          isPending={props.isPending}
          title="Prompt tokens received"
          description="Total tokens sent from users to Nebula as prompts"
          chartClassName="aspect-[1.5] lg:aspect-[4.5]"
          config={{
            totalPromptTokens: {
              label: "Total prompt tokens",
              color: "hsl(var(--chart-2))",
            },
          }}
        />

        <ThirdwebBarChart
          data={data.chartData}
          isPending={props.isPending}
          title="Response tokens sent"
          description="Total tokens sent from Nebula to users as responses"
          chartClassName="aspect-[1.5] lg:aspect-[4.5]"
          config={{
            totalCompletionTokens: {
              label: "Total response tokens",
              color: "hsl(var(--chart-5))",
            },
          }}
        />
      </div>
    </div>
  );
}

function StatCard(props: {
  title: string;
  value: number;
  icon: React.FC<{ className?: string }>;
  isPending: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm lg:text-base">{props.title}</h2>
        <props.icon className="size-4 text-muted-foreground" />
      </div>
      <SkeletonContainer
        className="inline-block"
        skeletonData={10000}
        loadedData={props.isPending ? undefined : props.value}
        render={(v) => (
          <p className="font-semibold text-2xl tracking-tight lg:text-3xl">
            {v}
          </p>
        )}
      />
    </div>
  );
}
