import { redirect } from "next/navigation";
import { getTeamBySlug } from "../../../../../../../../../@/api/team";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { fetchEcosystem } from "../../../utils/fetchEcosystem";
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
    fetchEcosystem(params.slug, authToken, params.team_slug),
    getTeamBySlug(params.team_slug),
  ]);

  if (!ecosystem) {
    redirect(ecosystemLayoutPath);
  }

  if (!team) {
    redirect("/team");
  }

  return (
    <EcosystemAnalyticsPage
      ecosystemSlug={ecosystem.slug}
      teamId={team.id}
      interval={searchParams.interval || "week"}
      range={
        searchParams.from && searchParams.to
          ? {
              from: new Date(searchParams.from),
              to: new Date(searchParams.to),
              type: "custom",
            }
          : undefined
      }
    />
  );
}
