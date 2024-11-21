import { getTeamBySlug } from "@/api/team";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { NebulaWaitListPage } from "../../../[project_slug]/nebula/components/nebula-waitlist-page";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    loginRedirect(`/team/${params.team_slug}/~/nebula`);
  }

  return <NebulaWaitListPage team={team} />;
}
