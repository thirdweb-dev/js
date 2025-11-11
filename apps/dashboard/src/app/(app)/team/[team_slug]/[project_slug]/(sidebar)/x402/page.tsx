import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import {
  X402SettlementsByPayerChart,
  X402SettlementsByResourceChart,
} from "./analytics";
import { ChartMetricSwitcher } from "./analytics/ChartsSection";
import { X402Summary } from "./analytics/Summary";
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

  const metric = (searchParams.metric as "payments" | "volume") || "volume";

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div className="flex flex-col gap-4 md:gap-6">
        <ResponsiveTimeFilters defaultRange={defaultRange} />
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
        <X402SettlementsByPayerChart
          authToken={authToken}
          interval={interval}
          metric={metric}
          projectId={project.id}
          range={range}
          teamId={project.teamId}
        />
        <div className="pt-4">
          <QuickStartSection />
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
