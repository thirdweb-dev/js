import { getTeamBySlug } from "@/api/team";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { NebulaAnalyticsPage } from "../../../[project_slug]/nebula/components/analytics/nebula-analytics-ui";
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

  const [account, authToken, team] = await Promise.all([
    getValidAccount(),
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
        accountId={account.id}
        authToken={authToken}
        searchParams={searchParams}
      />
    );
  }

  return <NebulaWaitListPage team={team} />;
}
