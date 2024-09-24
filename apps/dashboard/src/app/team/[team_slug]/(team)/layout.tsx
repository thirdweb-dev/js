import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { TeamHeader } from "../../components/TeamHeader/TeamHeader";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: { team_slug: string };
}) {
  const teams = await getTeams();
  const team = teams.find((t) => t.slug === props.params.team_slug);
  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  if (!team) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-muted/50">
        <TeamHeader
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
          currentProject={undefined}
        />

        <TabPathLinks
          tabContainerClassName="px-4 lg:px-6"
          links={[
            {
              path: `/team/${props.params.team_slug}`,
              name: "Projects",
              exactMatch: true,
            },
            {
              path: `/team/${props.params.team_slug}/~/usage`,
              name: "Usage",
            },
            {
              path: `/team/${props.params.team_slug}/~/settings`,
              name: "Settings",
            },
          ]}
        />
      </div>

      <main className="grow">{props.children}</main>
    </div>
  );
}
