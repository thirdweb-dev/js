import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { notFound, redirect } from "next/navigation";
import { TeamHeader } from "../../components/TeamHeader/TeamHeader";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: { team_slug: string; project_slug: string };
}) {
  const teams = await getTeams();
  const team = teams.find((t) => t.slug === props.params.team_slug);

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
    .find((t) => t.team.slug === props.params.team_slug)
    ?.projects.find((p) => p.slug === props.params.project_slug);

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${props.params.team_slug}`);
  }

  return (
    <div className="flex flex-col grow">
      <div className="bg-muted/50">
        <TeamHeader
          currentProject={project}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />
        <TabPathLinks
          tabContainerClassName="px-4 lg:px-6"
          links={[
            {
              path: `/team/${props.params.team_slug}/${props.params.project_slug}/connect/analytics`,
              name: "Connect",
            },
            {
              path: `/team/${props.params.team_slug}/${props.params.project_slug}/contracts`,
              name: "Contracts",
            },
            {
              path: `/team/${props.params.team_slug}/${props.params.project_slug}/engine`,
              name: "Engine",
            },
            {
              path: `/team/${props.params.team_slug}/${props.params.project_slug}/settings`,
              name: "Settings",
            },
          ]}
        />
      </div>
      <div className="grow flex flex-col">{props.children}</div>
    </div>
  );
}
