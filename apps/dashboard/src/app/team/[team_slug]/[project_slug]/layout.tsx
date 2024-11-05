import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { notFound, redirect } from "next/navigation";
import { TeamHeader } from "../../components/TeamHeader/TeamHeader";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const teams = await getTeams();
  const team = teams.find((t) => t.slug === params.team_slug);

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
    .find((t) => t.team.slug === params.team_slug)
    ?.projects.find((p) => p.slug === params.project_slug);

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex grow flex-col">
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
              path: `/team/${params.team_slug}/${params.project_slug}/connect/analytics`,
              name: "Connect",
            },
            {
              path: `/team/${params.team_slug}/${params.project_slug}/contracts`,
              name: "Contracts",
            },
            {
              path: `/team/${params.team_slug}/${params.project_slug}/engine`,
              name: "Engine",
            },
            {
              path: `/team/${params.team_slug}/${params.project_slug}/settings`,
              name: "Settings",
            },
          ]}
        />
      </div>
      <div className="flex grow flex-col">{props.children}</div>
    </div>
  );
}
