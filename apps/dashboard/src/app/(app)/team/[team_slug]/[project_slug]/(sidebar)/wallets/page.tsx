import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { getFiltersFromSearchParams } from "@/lib/time";
import { InAppWalletAnalytics } from "./analytics/chart";
import { InAppWalletsSummary } from "./analytics/chart/Summary";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
  }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

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

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div>
        <InAppWalletsSummary projectId={project.id} teamId={project.teamId} />
        <div className="h-10" />
        <ResponsiveTimeFilters defaultRange={defaultRange} />
        <div className="h-6" />
        <InAppWalletAnalytics
          interval={interval}
          projectId={project.id}
          range={range}
          teamId={project.teamId}
        />
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
