import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { redirect } from "next/navigation";
import { TeamHeader } from "../../../components/Header/TeamHeader/TeamHeader";
import TeamTabs from "../components/tab-switcher.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
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
    // not a valid team, redirect back to 404
    redirect("/404");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-muted/50">
        <TeamHeader
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
          currentProject={undefined}
        />

        <TeamTabs
          links={[
            {
              href: `/team/${props.params.team_slug}`,
              name: "Projects",
              strictMatch: true,
            },
            {
              href: `/team/${props.params.team_slug}/~/usage`,
              name: "Usage",
            },
            {
              href: `/team/${props.params.team_slug}/~/settings`,
              name: "Settings",
            },
          ]}
        />
      </div>

      <main className="grow">{props.children}</main>
    </div>
  );
}
