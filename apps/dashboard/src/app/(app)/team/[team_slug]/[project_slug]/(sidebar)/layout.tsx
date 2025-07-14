import { redirect } from "next/navigation";
import { isFeatureFlagEnabled } from "@/analytics/posthog-server";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getProject, getProjects, type Project } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { siwaExamplePrompts } from "../../../../(dashboard)/support/definitions";
import { getValidAccount } from "../../../../account/settings/getAccount";
import { TeamHeaderLoggedIn } from "../../../components/TeamHeader/team-header-logged-in.client";
import { StaffModeNotice } from "../../(team)/_components/StaffModeNotice";
import { ProjectSidebarLayout } from "./components/ProjectSidebarLayout";
import { SaveLastUsedProject } from "./components/SaveLastUsedProject";
import { getEngineInstances } from "./engine/dedicated/_utils/getEngineInstances";

export default async function ProjectLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [accountAddress, teams, account, authToken, team, project] =
    await Promise.all([
      getAuthTokenWalletAddress(),
      getTeams(),
      getValidAccount(`/team/${params.team_slug}/${params.project_slug}`),
      getAuthToken(),
      getTeamBySlug(params.team_slug),
      getProject(params.team_slug, params.project_slug),
    ]);

  if (!teams || !accountAddress || !authToken) {
    redirect("/login");
  }

  if (!team) {
    redirect("/team");
  }

  const teamsAndProjects = await Promise.all(
    teams.map(async (team) => ({
      projects: await getProjects(team.slug),
      team,
    })),
  );

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${params.team_slug}`);
  }

  const layoutPath = `/team/${params.team_slug}/${params.project_slug}`;
  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const [engineLinkType, isCentralizedWebhooksFeatureFlagEnabled] =
    await Promise.all([
      getEngineLinkType({
        authToken,
        project,
      }),
      isFeatureFlagEnabled({
        flagKey: "centralized-webhooks",
        accountId: account.id,
        email: account.email,
      }),
    ]);

  const isStaffMode = !teams.some((t) => t.slug === team.slug);

  return (
    <SidebarProvider>
      <div className="flex h-dvh min-w-0 grow flex-col">
        {isStaffMode && <StaffModeNotice />}
        <div className="sticky top-0 z-10 border-border border-b bg-card">
          <AnnouncementBanner />
          <TeamHeaderLoggedIn
            account={account}
            accountAddress={accountAddress}
            client={client}
            currentProject={project}
            currentTeam={team}
            teamsAndProjects={teamsAndProjects}
          />
        </div>
        <ProjectSidebarLayout
          engineLinkType={engineLinkType}
          layoutPath={layoutPath}
          isCentralizedWebhooksFeatureFlagEnabled={
            isCentralizedWebhooksFeatureFlagEnabled
          }
        >
          {props.children}
        </ProjectSidebarLayout>
      </div>
      <div className="fixed right-6 bottom-6 z-50">
        <CustomChatButton
          authToken={authToken}
          clientId={project.publishableKey}
          examplePrompts={siwaExamplePrompts}
          isFloating={true}
          isLoggedIn={true}
          label="Ask AI Assistant"
          networks="all"
          pageType="support"
          team={team}
        />
      </div>
      <SaveLastUsedProject projectId={project.id} teamId={team.id} />
    </SidebarProvider>
  );
}

async function getEngineLinkType(params: {
  authToken: string;
  project: Project;
}) {
  const projectEngineCloudService = params.project.services.find(
    (service) => service.name === "engineCloud",
  );

  const engineCloudToken = projectEngineCloudService?.managementAccessToken;

  // if we have a management access token, link to engine cloud page
  let engineLinkType: "cloud" | "dedicated" = "cloud";

  // if we don't have a engine cloud management access token, check if there are any legacy engine instances
  if (!engineCloudToken) {
    const engineInstances = await getEngineInstances({
      authToken: params.authToken,
      teamIdOrSlug: params.project.teamId,
    });
    // if we have any legacy engine instances, link to the legacy engine page
    if (engineInstances.data && engineInstances.data.length > 0) {
      engineLinkType = "dedicated";
    }
  }
  return engineLinkType;
}
