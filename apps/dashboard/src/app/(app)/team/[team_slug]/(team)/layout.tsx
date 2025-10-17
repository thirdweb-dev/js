import { redirect } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getProjects } from "@/api/project/projects";
import { fetchEcosystemList } from "@/api/team/ecosystems";
import { getTeamBySlug, getTeams } from "@/api/team/get-team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { siwaExamplePrompts } from "@/constants/siwa-example-prompts";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";
import { StaffModeNotice } from "./_components/StaffModeNotice";
import { TeamSidebarLayout } from "./TeamSidebarLayout";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;

  const [accountAddress, account, teams, authToken, team, ecosystems] =
    await Promise.all([
      getAuthTokenWalletAddress(),
      getValidAccount(`/team/${params.team_slug}`),
      getTeams(),
      getAuthToken(),
      getTeamBySlug(params.team_slug),
      fetchEcosystemList(params.team_slug),
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

  const isStaffMode = !teams.some((t) => t.slug === team.slug);

  return (
    <SidebarProvider>
      <div className="flex h-dvh min-w-0 grow flex-col">
        {isStaffMode && <StaffModeNotice />}
        <AnnouncementBanner />
        <div className="bg-card border-b">
          <TeamHeaderLoggedIn
            account={account}
            accountAddress={accountAddress}
            client={client}
            currentProject={undefined}
            currentTeam={team}
            teamsAndProjects={teamsAndProjects}
          />
        </div>

        <TeamSidebarLayout
          ecosystems={ecosystems.map((ecosystem) => ({
            name: ecosystem.name,
            slug: ecosystem.slug,
          }))}
          layoutPath={`/team/${params.team_slug}`}
        >
          {props.children}
        </TeamSidebarLayout>
        <CustomChatButton
          authToken={authToken}
          clientId={undefined}
          examplePrompts={siwaExamplePrompts}
          team={team}
        />
      </div>
    </SidebarProvider>
  );
}
