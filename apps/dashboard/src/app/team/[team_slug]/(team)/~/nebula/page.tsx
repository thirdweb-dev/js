import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
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

  // if nebula access is already granted, redirect to nebula web app
  const hasNebulaAccess = team.enabledScopes.includes("nebula");

  if (hasNebulaAccess) {
    redirect("https://nebula.thirdweb.com");
  }

  return <NebulaWaitListPage team={team} />;
}
