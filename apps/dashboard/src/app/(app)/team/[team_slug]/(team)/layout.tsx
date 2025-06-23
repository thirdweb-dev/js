import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { AppFooter } from "@/components/footers/app-footer";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { siwaExamplePrompts } from "../../../(dashboard)/support/definitions";
import { getValidAccount } from "../../../account/settings/getAccount";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;

  const [accountAddress, account, teams, authToken, team] = await Promise.all([
    getAuthTokenWalletAddress(),
    getValidAccount(`/team/${params.team_slug}`),
    getTeams(),
    getAuthToken(),
    getTeamBySlug(params.team_slug),
  ]);

  if (!teams || !accountAddress || !authToken || !team) {
    redirect("/login");
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      projects: await getProjects(team.slug),
      team,
    })),
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex h-full grow flex-col">
      {!teams.some((t) => t.slug === team.slug) && (
        <div className="bg-warning-text">
          <div className="container flex items-center justify-between py-4">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-white text-xl">👀 STAFF MODE 👀</p>
              <p className="text-sm text-white">
                You can only view this team, not take any actions.
              </p>
            </div>
            <Button asChild variant="default">
              <Link href="/team/~">Leave Staff Mode</Link>
            </Button>
          </div>
        </div>
      )}
      <AnnouncementBanner />
      <div className="bg-card">
        <TeamHeaderLoggedIn
          account={account}
          accountAddress={accountAddress}
          client={client}
          currentProject={undefined}
          currentTeam={team}
          teamsAndProjects={teamsAndProjects}
        />

        <TabPathLinks
          links={[
            {
              exactMatch: true,
              name: "Overview",
              path: `/team/${params.team_slug}`,
            },
            {
              name: "Analytics",
              path: `/team/${params.team_slug}/~/analytics`,
            },
            {
              name: "Ecosystems",
              path: `/team/${params.team_slug}/~/ecosystem`,
            },
            {
              name: "Usage",
              path: `/team/${params.team_slug}/~/usage`,
            },
            {
              name: "Audit Log",
              path: `/team/${params.team_slug}/~/audit-log`,
            },
            {
              name: "Settings",
              path: `/team/${params.team_slug}/~/settings`,
            },
          ]}
          tabContainerClassName="px-4 lg:px-6"
        />
      </div>

      <main className="flex grow flex-col">{props.children}</main>
      <div className="fixed right-6 bottom-6 z-50">
        <CustomChatButton
          authToken={authToken}
          clientId={undefined}
          examplePrompts={siwaExamplePrompts}
          isFloating={true}
          isLoggedIn={true}
          label="Ask AI Assistant"
          networks="all"
          pageType="support"
          teamId={team.id}
        />
      </div>
      <AppFooter />
    </div>
  );
}
