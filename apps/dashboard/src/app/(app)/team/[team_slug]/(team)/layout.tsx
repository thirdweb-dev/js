import { redirect } from "next/navigation";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { siwaExamplePrompts } from "../../../(dashboard)/support/definitions";
import { getValidAccount } from "../../../account/settings/getAccount";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";
import { StaffModeNotice } from "./_components/StaffModeNotice";
import type { Ecosystem } from "./~/ecosystem/types";
import { TeamSidebarLayout } from "./TeamSidebarLayout";

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

  const ecosystems = await fetchEcosystemList(team.id, authToken);

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
      </div>
    </SidebarProvider>
  );
}

async function fetchEcosystemList(teamId: string, authToken: string) {
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${teamId}/ecosystem-wallet`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!res.ok) {
    return [];
  }

  return (await res.json()).result as Ecosystem[];
}
