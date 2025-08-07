import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { fetchEcosystem } from "@/api/team/ecosystems";
import { getTeamBySlug } from "@/api/team/get-team";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { getFiltersFromSearchParams } from "@/lib/time";
import { fetchPartners } from "../configuration/hooks/fetchPartners";
import { EcosystemAnalyticsPage } from "./components/EcosystemAnalyticsPage";

export default async function Page(props: {
  params: Promise<{
    slug: string;
    team_slug: string;
  }>;
  searchParams: Promise<{
    interval?: "day" | "week";
    from?: string;
    to?: string;
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const ecosystemLayoutPath = `/team/${params.team_slug}/~/ecosystem`;
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect(ecosystemLayoutPath);
  }

  const [ecosystem, team] = await Promise.all([
    fetchEcosystem(params.slug, params.team_slug),
    getTeamBySlug(params.team_slug),
  ]);

  if (!ecosystem) {
    redirect(ecosystemLayoutPath);
  }

  if (!team) {
    redirect("/team");
  }

  const partners = await fetchPartners({
    authToken,
    ecosystem,
    teamId: team.id,
  });

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange,
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <EcosystemAnalyticsPage
        ecosystemSlug={ecosystem.slug}
        interval={interval}
        defaultRange={defaultRange}
        partners={partners}
        range={range}
        teamId={team.id}
      />
    </ResponsiveSearchParamsProvider>
  );
}
