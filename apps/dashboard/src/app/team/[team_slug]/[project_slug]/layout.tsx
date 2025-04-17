import { getProjects } from "@/api/projects";
import { getTeams } from "@/api/team";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { AnnouncementBanner } from "../../../../components/notices/AnnouncementBanner";
import { getValidAccount } from "../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../api/lib/getAuthToken";
import { TeamHeaderLoggedIn } from "../../components/TeamHeader/team-header-logged-in.client";
import { ProjectSidebarLayout } from "./components/ProjectSidebarLayout";
import { SaveLastUsedProject } from "./components/SaveLastUsedProject";

export default async function ProjectLayout(props: {
  children: React.ReactNode;
  breadcrumbNav: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const [accountAddress, teams, account] = await Promise.all([
    getAuthTokenWalletAddress(),
    getTeams(),
    getValidAccount(`/team/${params.team_slug}/${params.project_slug}`),
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

  const project = teamsAndProjects
    .find((t) => t.team.slug === decodeURIComponent(params.team_slug))
    ?.projects.find((p) => p.slug === params.project_slug);

  if (!project) {
    // not a valid project, redirect back to team page
    redirect(`/team/${params.team_slug}`);
  }

  const layoutPath = `/team/${params.team_slug}/${params.project_slug}`;

  return (
    <SidebarProvider>
      <div className="flex h-dvh min-w-0 grow flex-col">
        <div className="sticky top-0 z-10 border-border border-b bg-card">
          <AnnouncementBanner />
          <TeamHeaderLoggedIn
            currentProject={project}
            currentTeam={team}
            teamsAndProjects={teamsAndProjects}
            account={account}
            accountAddress={accountAddress}
          />
        </div>
        <ProjectSidebarLayout layoutPath={layoutPath}>
          {props.children}
        </ProjectSidebarLayout>
      </div>
      <SaveLastUsedProject projectId={project.id} teamId={team.id} />
    </SidebarProvider>
  );
}
