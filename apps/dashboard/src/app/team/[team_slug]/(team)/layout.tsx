import { getProjects } from "@/api/projects";
import { getTeamNebulaWaitList, getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { AnnouncementBanner } from "../../../../components/notices/AnnouncementBanner";
import { getValidAccount } from "../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../api/lib/getAuthToken";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;

  const [accountAddress, account, teams] = await Promise.all([
    getAuthTokenWalletAddress(),
    getValidAccount(`/team/${params.team_slug}`),
    getTeams(),
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

  const isOnNebulaWaitList = (await getTeamNebulaWaitList(team.slug))
    ?.onWaitlist;

  return (
    <div className="flex h-full grow flex-col">
      <AnnouncementBanner />
      <div className="bg-card">
        <TeamHeaderLoggedIn
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
          currentProject={undefined}
          account={account}
          accountAddress={accountAddress}
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
      <AppFooter />
    </div>
  );
}
