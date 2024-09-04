import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { redirect } from "next/navigation";
import { TeamHeader } from "../../../components/Header/TeamHeader/TeamHeader";
import TeamTabs from "../components/tab-switcher.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: { team_slug: string; project_slug: string };
}) {
  const teams = await getTeams();
  const team = teams.find((t) => t.slug === props.params.team_slug);

  if (!team) {
    // not a valid team, redirect back to 404
    redirect("/404");
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  const project = teamsAndProjects
    .find((t) => t.team.slug === props.params.team_slug)
    ?.projects.find((p) => p.slug === props.params.project_slug);

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${props.params.team_slug}`);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-muted/50">
        <TeamHeader
          currentProject={project}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />
        <TeamTabs
          links={[
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/connect`,
              name: "Connect",
            },
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/contracts`,
              name: "Contracts",
            },
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/engine`,
              name: "Engine",
            },
            {
              href: `/team/${props.params.team_slug}/${props.params.project_slug}/settings`,
              name: "Settings",
            },
          ]}
        />
      </div>
      <main className="grow">{props.children}</main>
    </div>
  );
}
