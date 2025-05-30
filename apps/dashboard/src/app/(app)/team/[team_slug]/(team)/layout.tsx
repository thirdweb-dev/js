import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { TabPathLinks } from "@/components/ui/tabs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { AnnouncementBanner } from "components/notices/AnnouncementBanner";
import { redirect } from "next/navigation";
import { siwaExamplePrompts } from "../../../(dashboard)/support/page";
import { CustomChatButton } from "../../../../nebula-app/(app)/components/CustomChat/CustomChatButton";
import { getValidAccount } from "../../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../api/lib/getAuthToken";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;

  const [accountAddress, account, teams, authToken] = await Promise.all([
    getAuthTokenWalletAddress(),
    getValidAccount(`/team/${params.team_slug}`),
    getTeams(),
    getAuthToken(),
  ]);

  if (!teams || !accountAddress || !authToken) {
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

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

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
          client={client}
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
              path: `/team/${params.team_slug}/~/ecosystem`,
              name: "Ecosystems",
            },
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
      <div className="fixed right-6 bottom-6 z-50">
        <CustomChatButton
          clientId={undefined}
          isLoggedIn={true}
          networks="all"
          isFloating={true}
          pageType="support"
          label="Ask AI Assistant"
          examplePrompts={siwaExamplePrompts}
          teamId={team.id}
          authToken={authToken}
        />
      </div>
      <AppFooter />
    </div>
  );
}
