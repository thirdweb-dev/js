import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getX402Settlements } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { getProjectWallet } from "@/lib/server/project-wallet";
import { getFiltersFromSearchParams } from "@/lib/time";
import type { X402SettlementsOverall } from "@/types/analytics";
import { loginRedirect } from "@/utils/redirects";
import {
  X402SettlementsByChainChart,
  X402SettlementsByPayerChart,
  X402SettlementsByResourceChart,
} from "./analytics";
import { ChartMetricSwitcher } from "./analytics/ChartsSection";
import { X402Summary } from "./analytics/Summary";
import { X402EmptyState } from "./components/X402EmptyState";
import { QuickStartSection } from "./QuickstartSection.client";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
    metric?: string;
  }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const authToken = await getAuthToken();
  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/x402`);
  }

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange,
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  const project = await getProject(params.team_slug, params.project_slug);
  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  // Check if there are any payments to determine if we should show empty state
  const overallStats = await getX402Settlements(
    {
      from: range.from,
      period: "all",
      projectId: project.id,
      teamId: project.teamId,
      to: range.to,
      groupBy: "overall",
    },
    authToken,
  ).catch(() => []);

  const totalPayments = (overallStats as X402SettlementsOverall[]).reduce(
    (acc, curr) => acc + curr.totalRequests,
    0,
  );

  // Get project wallet for prefilling the code snippet
  const projectWallet = await getProjectWallet(project);

  const metric = (searchParams.metric as "payments" | "volume") || "payments";

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div className="flex flex-col gap-4 md:gap-6">
        <ResponsiveTimeFilters defaultRange={defaultRange} />
        {totalPayments === 0 ? (
          <X402EmptyState walletAddress={projectWallet?.address} />
        ) : (
          <>
            <X402Summary
              authToken={authToken}
              projectId={project.id}
              range={range}
              teamId={project.teamId}
            />
            <ChartMetricSwitcher />
            <X402SettlementsByResourceChart
              authToken={authToken}
              interval={interval}
              metric={metric}
              projectId={project.id}
              range={range}
              teamId={project.teamId}
            />
            <X402SettlementsByChainChart
              authToken={authToken}
              interval={interval}
              metric={metric}
              projectId={project.id}
              range={range}
              teamId={project.teamId}
            />
            <X402SettlementsByPayerChart
              authToken={authToken}
              interval={interval}
              metric={metric}
              projectId={project.id}
              range={range}
              teamId={project.teamId}
            />
          </>
        )}
        <div className="pt-4">
          <QuickStartSection />
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
