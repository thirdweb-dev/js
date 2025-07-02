import "server-only";

import { ActivityIcon, AlertCircleIcon, CloudAlertIcon } from "lucide-react";
import { ResponsiveSuspense } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import {
  getInsightChainUsage,
  getInsightEndpointUsage,
  getInsightStatusCodeUsage,
  getInsightUsage,
} from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { StatCard } from "@/components/analytics/stat";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InsightAnalyticsFilter } from "./InsightAnalyticsFilter";
import { InsightFTUX } from "./insight-ftux";
import { RequestsByStatusGraph } from "./RequestsByStatusGraph";
import { TopInsightChainsTable } from "./TopChainsTable";
import { TopInsightEndpointsTable } from "./TopEndpointsTable";

// Error state component for analytics
function AnalyticsErrorState({
  title,
  message,
  className,
}: {
  title: string;
  message: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircleIcon className="size-6 text-destructive" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export async function InsightAnalytics(props: {
  projectClientId: string;
  client: ThirdwebClient;
  projectId: string;
  teamId: string;
  range: Range;
  interval: "day" | "week";
}) {
  const { projectId, teamId, range, interval } = props;

  const allTimeRequestsPromise = getInsightUsage({
    from: range.from,
    period: "all",
    projectId: projectId,
    teamId: teamId,
    to: range.to,
  });
  const chainsDataPromise = getInsightChainUsage({
    from: range.from,
    limit: 10,
    period: "all",
    projectId: projectId,
    teamId: teamId,
    to: range.to,
  });
  const statusCodesDataPromise = getInsightStatusCodeUsage({
    from: range.from,
    period: interval,
    projectId: projectId,
    teamId: teamId,
    to: range.to,
  });
  const endpointsDataPromise = getInsightEndpointUsage({
    from: range.from,
    limit: 10,
    period: "all",
    projectId: projectId,
    teamId: teamId,
    to: range.to,
  });

  const [allTimeRequestsData, statusCodesData, endpointsData, chainsData] =
    await Promise.all([
      allTimeRequestsPromise,
      statusCodesDataPromise,
      endpointsDataPromise,
      chainsDataPromise,
    ]);

  const hasVolume =
    "data" in allTimeRequestsData &&
    allTimeRequestsData.data?.some((d) => d.totalRequests > 0);

  const allTimeRequests =
    "data" in allTimeRequestsData
      ? allTimeRequestsData.data?.reduce(
          (acc, curr) => acc + curr.totalRequests,
          0,
        )
      : 0;

  let requestsInPeriod = 0;
  let errorsInPeriod = 0;
  if ("data" in statusCodesData) {
    for (const request of statusCodesData.data) {
      requestsInPeriod += request.totalRequests;
      if (request.httpStatusCode >= 400) {
        errorsInPeriod += request.totalRequests;
      }
    }
  }
  const errorRate = Number(
    ((errorsInPeriod / (requestsInPeriod || 1)) * 100).toFixed(2),
  );

  if (!hasVolume) {
    return (
      <div className="flex grow flex-col">
        <InsightFTUX clientId={props.projectClientId} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-start">
        <InsightAnalyticsFilter />
      </div>
      <ResponsiveSuspense
        fallback={
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <Skeleton className="h-[88px] border rounded-xl" />
              <Skeleton className="h-[88px] border rounded-xl" />
            </div>
            <Skeleton className="h-[480px] border rounded-xl" />
            <Skeleton className="h-[376px] border rounded-xl" />
          </div>
        }
        searchParamsUsed={["from", "to", "interval"]}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <StatCard
              icon={ActivityIcon}
              isPending={false}
              label="Total Requests"
              value={allTimeRequests}
            />
            <StatCard
              formatter={(value) => `${value}%`}
              icon={CloudAlertIcon}
              isPending={false}
              label="Error rate"
              value={errorRate}
            />
          </div>

          {"errorMessage" in statusCodesData ? (
            <AnalyticsErrorState
              message={statusCodesData.errorMessage}
              title="Failed to load status code analytics"
            />
          ) : (
            <RequestsByStatusGraph
              data={"data" in statusCodesData ? statusCodesData.data : []}
              description="The number of requests by status code over time."
              isPending={false}
              title="Requests by Status Code"
            />
          )}

          <GridWithSeparator>
            <div className="border-border border-b pb-6 xl:border-none xl:pb-0">
              {"errorMessage" in endpointsData ? (
                <AnalyticsErrorState
                  message={endpointsData.errorMessage}
                  title="Failed to load endpoint analytics"
                />
              ) : (
                <TopInsightEndpointsTable
                  client={props.client}
                  data={"data" in endpointsData ? endpointsData.data : []}
                />
              )}
            </div>
            {"errorMessage" in chainsData ? (
              <AnalyticsErrorState
                message={chainsData.errorMessage}
                title="Failed to load chain analytics"
              />
            ) : (
              <TopInsightChainsTable
                client={props.client}
                data={"data" in chainsData ? chainsData.data : []}
              />
            )}
          </GridWithSeparator>
        </div>
      </ResponsiveSuspense>
    </div>
  );
}

function GridWithSeparator(props: { children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-1 gap-6 rounded-xl border border-border bg-card p-4 lg:gap-12 xl:grid-cols-2 xl:p-6">
      {props.children}
      {/* Desktop - horizontal middle */}
      <div className="absolute top-6 bottom-6 left-[50%] hidden w-[1px] bg-border xl:block" />
    </div>
  );
}
