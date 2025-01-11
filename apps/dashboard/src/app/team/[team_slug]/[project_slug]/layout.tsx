import { getProjects } from "@/api/projects";
import { getTeamNebulaWaitList, getTeams } from "@/api/team";
import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "../../../account/settings/getAccount";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";
import { ProjectTabs } from "./tabs";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [teams, account] = await Promise.all([
    getTeams(),
    getValidAccount(`/team/${params.team_slug}/${params.project_slug}`),
  ]);

  if (!teams) {
    redirect("/login");
  }

  const team = teams.find(
    (t) => t.slug === decodeURIComponent(params.team_slug),
  );

  if (!team) {
    // not a valid team, redirect back to 404
    notFound();
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

  const isOnNebulaWaitList = (await getTeamNebulaWaitList(team.slug))
    ?.onWaitlist;

  return (
    <div className="flex grow flex-col">
      <div className="bg-muted/50">
        <TeamHeaderLoggedIn
          currentProject={project}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
          account={account}
        />
        <ProjectTabs
          layoutPath={`/team/${params.team_slug}/${params.project_slug}`}
          isOnNebulaWaitList={!!isOnNebulaWaitList}
        />
      </div>
      <div className="flex grow flex-col">{props.children}</div>
    </div>
  );
}
