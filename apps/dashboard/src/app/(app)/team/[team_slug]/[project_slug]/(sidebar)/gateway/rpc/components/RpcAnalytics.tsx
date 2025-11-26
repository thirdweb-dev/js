import { ActivityIcon } from "lucide-react";
import { ResponsiveSuspense } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import { getRpcMethodUsage, getRpcUsageByType } from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { StatCard } from "@/components/analytics/stat";
import { Skeleton } from "@/components/ui/skeleton";
import { RpcMethodBarChartCardAsync } from "../../../components/RpcMethodBarChartCard";
import { TopRPCMethodsTable } from "./MethodsTable";
import { RPCRequestsChartUI } from "./RequestsGraph";
import { RpcAnalyticsFilter } from "./RpcAnalyticsFilter";
import { RpcFTUX } from "./RpcFtux";

export async function RPCAnalytics(props: {
  projectClientId: string;
  client: ThirdwebClient;
  projectId: string;
  teamId: string;
  range: Range;
  interval: "day" | "week";
  authToken: string;
}) {
  const { projectId, teamId, range, interval, authToken } = props;

  // TODO: add requests by status code filter, but currently not performant enough
  const allRequestsByUsageTypePromise = getRpcUsageByType(
    {
      from: range.from,
      period: "all",
      projectId: projectId,
      teamId: teamId,
      to: range.to,
    },
    authToken,
  );
  const requestsByUsageTypePromise = getRpcUsageByType(
    {
      from: range.from,
      period: interval,
      projectId: projectId,
      teamId: teamId,
      to: range.to,
    },
    authToken,
  );
  const evmMethodsPromise = getRpcMethodUsage(
    {
      from: range.from,
      period: "all",
      projectId: projectId,
      teamId: teamId,
      to: range.to,
    },
    authToken,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  const [allUsageData, usageData, evmMethodsData] = await Promise.all([
    allRequestsByUsageTypePromise,
    requestsByUsageTypePromise,
    evmMethodsPromise,
  ]);

  const totalRequests = allUsageData.reduce((acc, curr) => acc + curr.count, 0);

  if (totalRequests < 1) {
    return (
      <div className="flex grow flex-col">
        <RpcFTUX clientId={props.projectClientId} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-start">
        <RpcAnalyticsFilter />
      </div>
      <ResponsiveSuspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[88px] border rounded-xl" />
            <Skeleton className="h-[425px] border rounded-xl" />
            <Skeleton className="h-[360px] border rounded-xl" />
          </div>
        }
        searchParamsUsed={["from", "to", "interval"]}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <StatCard
              icon={ActivityIcon}
              isPending={false}
              label="All Time Requests"
              value={totalRequests}
            />
          </div>
          <RPCRequestsChartUI data={usageData} viewMoreLink={undefined} />
          <TopRPCMethodsTable
            client={props.client}
            data={evmMethodsData || []}
          />
        </div>
      </ResponsiveSuspense>

      <div className="h-6" />

      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[377px] border" />}
        searchParamsUsed={["from", "to", "interval"]}
      >
        <RpcMethodBarChartCardAsync
          params={{
            from: range.from,
            period: interval,
            projectId: projectId,
            teamId: teamId,
            to: range.to,
          }}
          authToken={authToken}
        />
      </ResponsiveSuspense>
    </div>
  );
}
