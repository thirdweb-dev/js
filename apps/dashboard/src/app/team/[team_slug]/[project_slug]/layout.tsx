import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../api/lib/getAuthToken";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";
import { SaveLastUsedProject } from "./components/SaveLastUsedProject";
import { ProjectTabs } from "./tabs";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [accountAddress, teams, account] = await Promise.all([
    getAuthTokenWalletAddress(),
    getTeams(),
    getValidAccount(`/team/${params.team_slug}/${params.project_slug}`),
  ]);

  if (!teams || !accountAddress) {
    redirect("/login");
  }

  const team = teams.find(
    (t) => t.slug === decodeURIComponent(params.team_slug),
  );

  if (!team) {
    redirect("/team");
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  const project = teamsAndProjects
    .find((t) => t.team.slug === decodeURIComponent(params.team_slug))
    ?.projects.find((p) => p.slug === params.project_slug);

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex grow flex-col">
      <div className="bg-card">
        <TeamHeaderLoggedIn
          currentProject={project}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
          account={account}
          accountAddress={accountAddress}
        />
        <ProjectTabs
          layoutPath={`/team/${params.team_slug}/${params.project_slug}`}
        />
      </div>
      <div className="flex grow flex-col">{props.children}</div>
      <SaveLastUsedProject projectId={project.id} teamId={team.id} />
    </div>
  );
}
