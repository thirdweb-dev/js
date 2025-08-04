import { subDays } from "date-fns";
import { redirect } from "next/navigation";
import { getWalletConnections } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProjects, type Project } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { DismissibleAlert } from "@/components/blocks/dismissible-alert";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { Changelog } from "./_components/Changelog";
import { FreePlanUpsellBannerUI } from "./_components/FreePlanUpsellBannerUI";
import { InviteTeamMembersButton } from "./_components/invite-team-members-button";
import {
  type ProjectWithAnalytics,
  TeamProjectsPage,
} from "./~/projects/TeamProjectsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const [team, authToken] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}`);
  }

  if (!team) {
    redirect("/team");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const projects = await getProjects(params.team_slug);
  const projectsWithTotalWallets = await getProjectsWithAnalytics(projects);

  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b">
        <div className="container flex max-w-6xl flex-col items-start gap-3 py-10 md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="font-semibold text-3xl tracking-tight">
              Team Overview
            </h1>
          </div>
          <InviteTeamMembersButton teamSlug={params.team_slug} />
        </div>
      </div>

      <div className="container flex max-w-6xl flex-col gap-10 py-6 pb-20">
        <TeamProjectsPage
          client={client}
          projects={projectsWithTotalWallets}
          team={team}
        />

        {team.billingPlan === "free" ? (
          <FreePlanUpsellBannerUI highlightPlan="growth" teamSlug={team.slug} />
        ) : (
          <DismissibleAlert
            description="Engines, contracts, project settings, and more are now managed within projects. Open or create a project to access them."
            localStorageId={`${team.id}-engines-alert`}
            title="Looking for Engines?"
          />
        )}

        <Changelog />
      </div>
    </div>
  );
}

async function getProjectsWithAnalytics(
  projects: Project[],
): Promise<Array<ProjectWithAnalytics>> {
  return Promise.all(
    projects.map(async (project) => {
      try {
        const today = new Date();
        const thirtyDaysAgo = subDays(today, 30);

        const data = await getWalletConnections({
          from: thirtyDaysAgo,
          period: "all",
          projectId: project.id,
          teamId: project.teamId,
          to: today,
        });

        let uniqueWalletsConnected = 0;
        for (const d of data) {
          uniqueWalletsConnected += d.uniqueWalletsConnected;
        }

        return {
          ...project,
          monthlyActiveUsers: uniqueWalletsConnected,
        };
      } catch {
        return {
          ...project,
          monthlyActiveUsers: 0,
        };
      }
    }),
  );
}
