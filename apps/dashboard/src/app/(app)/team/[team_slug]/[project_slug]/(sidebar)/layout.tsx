import { getProject, getProjects } from "@/api/projects";
import { getTeamBySlug, getTeams } from "@/api/team";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { AnnouncementBanner } from "components/notices/AnnouncementBanner";
import Link from "next/link";
import { redirect } from "next/navigation";
import { siwaExamplePrompts } from "../../../../(dashboard)/support/definitions";
import { CustomChatButton } from "../../../../../../components/CustomChat/CustomChatButton";
import { getValidAccount } from "../../../../account/settings/getAccount";
import {
  getAuthToken,
  getAuthTokenWalletAddress,
} from "../../../../api/lib/getAuthToken";
import { TeamHeaderLoggedIn } from "../../../components/TeamHeader/team-header-logged-in.client";
import { ProjectSidebarLayout } from "./components/ProjectSidebarLayout";
import { SaveLastUsedProject } from "./components/SaveLastUsedProject";

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
      team,
      projects: await getProjects(team.slug),
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

  return (
    <SidebarProvider>
      <div className="flex h-dvh min-w-0 grow flex-col">
        {!teams.some((t) => t.slug === team.slug) && (
          <div className="bg-warning-text">
            <div className="container flex items-center justify-between py-4">
              <div className="flex flex-col gap-2">
                <p className="font-bold text-white text-xl">👀 STAFF MODE 👀</p>
                <p className="text-sm text-white">
                  You can only view this team, not take any actions.
                </p>
              </div>
              <Button variant="default" asChild>
                <Link href="/team/~">Leave Staff Mode</Link>
              </Button>
            </div>
          </div>
        )}
        <div className="sticky top-0 z-10 border-border border-b bg-card">
          <AnnouncementBanner />
          <TeamHeaderLoggedIn
            currentProject={project}
            currentTeam={team}
            teamsAndProjects={teamsAndProjects}
            account={account}
            accountAddress={accountAddress}
            client={client}
          />
        </div>
        <ProjectSidebarLayout layoutPath={layoutPath}>
          {props.children}
        </ProjectSidebarLayout>
      </div>
      <div className="fixed right-6 bottom-6 z-50">
        <CustomChatButton
          isLoggedIn={true}
          networks="all"
          isFloating={true}
          pageType="support"
          label="Ask AI Assistant"
          examplePrompts={siwaExamplePrompts}
          teamId={team.id}
          clientId={project.publishableKey}
          authToken={authToken}
        />
      </div>
      <SaveLastUsedProject projectId={project.id} teamId={team.id} />
    </SidebarProvider>
  );
}
