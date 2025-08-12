import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeams } from "@/api/team/get-team";
import { getMemberByAccountId } from "@/api/team/team-members";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
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
      const member = await getMemberByAccountId(team.slug, account.id);

      if (!member) {
        notFound();
      }

      return {
        role: member.role,
        team,
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
      client={client}
      isOwnerAccount={isOwnerAccount}
      project={project}
      showNebulaSettings={currentTeam.enabledScopes.includes("nebula")}
      teamId={currentTeam.id}
      teamSlug={team_slug}
      teamsWithRole={teamsWithRole}
    />
  );
}
