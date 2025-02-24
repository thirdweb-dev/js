import { getTeamBySlug } from "@/api/team";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { NebulaAnalyticsPage } from "../../../[project_slug]/nebula/components/analytics/nebula-analytics-page";
import { NebulaWaitListPage } from "../../../[project_slug]/nebula/components/nebula-waitlist-page";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
  searchParams: Promise<{
    from: string | undefined | string[];
    to: string | undefined | string[];
    interval: string | undefined | string[];
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
  ]);

  if (!team || !authToken) {
    loginRedirect(`/team/${params.team_slug}/~/nebula`);
  }

  const hasNebulaAccess = team.enabledScopes.includes("nebula");

  if (hasNebulaAccess) {
    return (
      <NebulaAnalyticsPage
        teamId={team.id}
        authToken={authToken}
        searchParams={searchParams}
      />
    );
  }

  return <NebulaWaitListPage team={team} />;
}
