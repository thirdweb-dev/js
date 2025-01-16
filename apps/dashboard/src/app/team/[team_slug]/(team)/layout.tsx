import { getProjects } from "@/api/projects";
import { getTeamNebulaWaitList, getTeams } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "../../../account/settings/getAccount";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;

  const [account, teams] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}`),
    getTeams(),
  ]);

  if (!teams) {
    redirect("/login");
  }

  const team = teams.find(
    (t) => t.slug === decodeURIComponent(params.team_slug),
  );
  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      team,
      projects: await getProjects(team.slug),
    })),
  );

  if (!team) {
    notFound();
  }

  const isOnNebulaWaitList = (await getTeamNebulaWaitList(team.slug))
    ?.onWaitlist;

  return (
    <div className="flex h-full grow flex-col">
      <div className="bg-card">
        <TeamHeaderLoggedIn
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
          currentProject={undefined}
          account={account}
        />

        <TabPathLinks
          tabContainerClassName="px-4 lg:px-6"
          links={[
            {
              path: `/team/${params.team_slug}`,
              name: "Overview",
              exactMatch: true,
            },
            {
              path: `/team/${params.team_slug}/~/analytics`,
              name: "Analytics",
            },
            {
              path: `/team/${params.team_slug}/~/contracts`,
              name: "Contracts",
            },
            {
              path: `/team/${params.team_slug}/~/engine`,
              name: "Engines",
            },
            {
              path: `/team/${params.team_slug}/~/ecosystem`,
              name: "Ecosystems",
            },
            ...(isOnNebulaWaitList
              ? [
                  {
                    path: `/team/${params.team_slug}/~/nebula`,
                    name: "Nebula",
                  },
                ]
              : []),
            {
              path: `/team/${params.team_slug}/~/usage`,
              name: "Usage",
            },
            {
              path: `/team/${params.team_slug}/~/settings`,
              name: "Settings",
            },
          ]}
        />
      </div>

      <main className="flex grow flex-col">{props.children}</main>
    </div>
  );
}
