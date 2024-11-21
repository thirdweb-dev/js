import { getProjects } from "@/api/projects";
import { getTeamNebulaWaitList, getTeams } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { notFound, redirect } from "next/navigation";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const teams = await getTeams();

  if (!teams) {
    redirect("/login");
  }

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

  const isOnNebulaWaitList = (await getTeamNebulaWaitList(team.slug))
    ?.onWaitlist;

  return (
    <div className="flex grow flex-col">
      <div className="bg-muted/50">
        <TeamHeaderLoggedIn
          currentProject={project}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />
        <TabPathLinks
          tabContainerClassName="px-4 lg:px-6"
          links={[
            {
              path: `/team/${params.team_slug}/${params.project_slug}`,
              exactMatch: true,
              name: "Overview",
            },
            {
              path: `/team/${params.team_slug}/${params.project_slug}/connect`,
              name: "Connect",
            },
            {
              path: `/team/${params.team_slug}/${params.project_slug}/contracts`,
              name: "Contracts",
            },
            ...(isOnNebulaWaitList
              ? [
                  {
                    path: `/team/${params.team_slug}/${params.project_slug}/nebula`,
                    name: "Nebula",
                  },
                ]
              : []),
            {
              path: `/team/${params.team_slug}/${params.project_slug}/insight`,
              name: "Insight",
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
