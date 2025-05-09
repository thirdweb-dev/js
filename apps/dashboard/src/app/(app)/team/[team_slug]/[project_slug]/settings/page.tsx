import { getProject } from "@/api/projects";
import { getTeams } from "@/api/team";
import { getMemberById } from "@/api/team-members";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";
import { ProjectGeneralSettingsPage } from "./ProjectGeneralSettingsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;
  const pagePath = `/team/${team_slug}/${project_slug}/settings`;

  const [authToken, teams, project, account] = await Promise.all([
    getAuthToken(),
    getTeams(),
    getProject(team_slug, project_slug),
    getValidAccount("/account"),
  ]);

  if (!teams || !authToken) {
    loginRedirect(pagePath);
  }

  const currentTeam = teams.find((t) => t.slug === team_slug);

  if (!currentTeam) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const teamsWithRole = await Promise.all(
    teams.map(async (team) => {
      const member = await getMemberById(team.slug, account.id);

      if (!member) {
        notFound();
      }

      return {
        team,
        role: member.role,
      };
    }),
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: currentTeam.id,
  });

  const currentTeamWithRole = teamsWithRole.find(
    (teamWithRole) => teamWithRole.team.id === currentTeam.id,
  );

  const isOwnerAccount = currentTeamWithRole?.role === "OWNER";

  return (
    <ProjectGeneralSettingsPage
      project={project}
      teamSlug={team_slug}
      showNebulaSettings={currentTeam.enabledScopes.includes("nebula")}
      client={client}
      teamId={currentTeam.id}
      teamsWithRole={teamsWithRole}
      isOwnerAccount={isOwnerAccount}
    />
  );
}
