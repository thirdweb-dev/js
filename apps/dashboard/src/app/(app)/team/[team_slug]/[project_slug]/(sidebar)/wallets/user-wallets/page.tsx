import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { EOAConnectionsChart } from "../analytics/chart/eoa-connections-chart";
import { InAppWalletsSummary } from "../analytics/chart/Summary";
import { UserWalletConnectionsChart } from "../analytics/chart/user-wallet-connections-chart";

export const dynamic = "force-dynamic";

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

  const authToken = await getAuthToken();
  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/wallets/user-wallets`,
    );
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

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <div className="flex flex-col gap-4 md:gap-6">
        <ResponsiveTimeFilters defaultRange={defaultRange} />
        <InAppWalletsSummary
          authToken={authToken}
          projectId={project.id}
          range={range}
          teamId={project.teamId}
        />
        <UserWalletConnectionsChart
          authToken={authToken}
          projectId={project.id}
          from={range.from}
          to={range.to}
          interval={interval}
          teamId={project.teamId}
        />

        <EOAConnectionsChart
          authToken={authToken}
          projectId={project.id}
          from={range.from}
          to={range.to}
          interval={interval}
          teamId={project.teamId}
        />
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
