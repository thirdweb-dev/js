import { redirect } from "next/navigation";
import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken, getAuthTokenWalletAddress } from "@/api/auth-token";
import { getProject, getProjects } from "@/api/project/projects";
import { getTeamBySlug, getTeams } from "@/api/team/get-team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { AnnouncementBanner } from "@/components/misc/AnnouncementBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { siwaExamplePrompts } from "@/constants/siwa-example-prompts";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TeamHeaderLoggedIn } from "../../../components/TeamHeader/team-header-logged-in.client";
import { StaffModeNotice } from "../../(team)/_components/StaffModeNotice";
import { ProjectSidebarLayout } from "./components/ProjectSidebarLayout";
import { SaveLastUsedProject } from "./components/SaveLastUsedProject";
import { getEngineInstances } from "./engine/_utils/getEngineInstances";

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

  const engineInstances = await getEngineInstances({
    authToken: authToken,
    teamIdOrSlug: project.teamId,
  });

  const hasEngineInstances = !!engineInstances.data?.length;

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
          layoutPath={layoutPath}
          hasEngineInstances={hasEngineInstances}
        >
          {props.children}
        </ProjectSidebarLayout>
      </div>
      <div className="fixed right-4 bottom-4 z-50">
        <CustomChatButton
          authToken={authToken}
          clientId={project.publishableKey}
          examplePrompts={siwaExamplePrompts}
          label="Ask AI Assistant"
          team={team}
        />
      </div>
      <SaveLastUsedProject projectId={project.id} teamId={team.id} />
    </SidebarProvider>
  );
}
