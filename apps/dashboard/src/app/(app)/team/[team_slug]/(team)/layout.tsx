import { redirect } from "next/navigation";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { fetchEcosystemList } from "@/api/ecosystems";
import { getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { getChainSubscriptions } from "@/api/team-subscription";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getChain } from "../../../(dashboard)/(chain)/utils";
import { siwaExamplePrompts } from "../../../(dashboard)/support/definitions";
import { getValidAccount } from "../../../account/settings/getAccount";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";
import { StaffModeNotice } from "./_components/StaffModeNotice";
import { TeamSidebarLayout } from "./TeamSidebarLayout";

export default async function TeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;

  const [
    accountAddress,
    account,
    teams,
    authToken,
    team,
    ecosystems,
    chainSubscriptions,
  ] = await Promise.all([
    getAuthTokenWalletAddress(),
    getValidAccount(`/team/${params.team_slug}`),
    getTeams(),
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    fetchEcosystemList(params.team_slug),
    getChainSubscriptions(params.team_slug),
  ]);

  if (!teams || !accountAddress || !authToken || !team) {
    redirect("/login");
  }

  const [teamsAndProjects, chainSidebarLinks] = await Promise.all([
    Promise.all(
      teams.map(async (team) => ({
        projects: await getProjects(team.slug),
        team,
      })),
    ),
    chainSubscriptions
      ? await Promise.all(
          chainSubscriptions.map(async (chainSubscription) => {
            if (!chainSubscription.chainId) {
              throw new Error("Chain ID is required");
            }
            const chain = await getChain(chainSubscription.chainId);

            return {
              chainId: chain.chainId,
              chainName: chain.name,
              slug: chain.slug,
            };
          }),
        ).catch(() => [])
      : [],
  ]);

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
          chainSubscriptions={chainSidebarLinks.sort(
            (a, b) => a.chainId - b.chainId,
          )}
          ecosystems={ecosystems.map((ecosystem) => ({
            name: ecosystem.name,
            slug: ecosystem.slug,
          }))}
          layoutPath={`/team/${params.team_slug}`}
        >
          {props.children}
        </TeamSidebarLayout>
        {team && (
          <div className="fixed right-6 bottom-6 z-50">
            <CustomChatButton
              authToken={authToken}
              clientId={undefined}
              examplePrompts={siwaExamplePrompts}
              isFloating={true}
              isLoggedIn={true}
              label="Get Help"
              networks="all"
              pageType="support"
              team={team}
            />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
