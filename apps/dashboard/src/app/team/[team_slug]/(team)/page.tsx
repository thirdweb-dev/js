import { getWalletConnections } from "@/api/analytics";
import { type Project, getProjects } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { Changelog } from "components/dashboard/Changelog";
import { subDays } from "date-fns";
import { redirect } from "next/navigation";
import {
  type ProjectWithAnalytics,
  TeamProjectsPage,
} from "./~/projects/TeamProjectsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const projects = await getProjects(params.team_slug);
  const projectsWithTotalWallets = await getProjectsWithAnalytics(projects);

  return (
    <div className="container flex grow flex-col gap-12 py-8 lg:flex-row">
      <div className="flex grow flex-col">
        <h1 className="mb-4 font-semibold text-2xl tracking-tight">Projects</h1>
        <TeamProjectsPage projects={projectsWithTotalWallets} team={team} />
      </div>
      <div className="shrink-0 lg:w-[320px]">
        <h2 className="mb-4 font-semibold text-2xl tracking-tight">
          Changelog
        </h2>
        <Changelog />
      </div>
    </div>
  );
}

async function getProjectsWithAnalytics(
  projects: Project[],
): Promise<Array<ProjectWithAnalytics>> {
  return Promise.all(
    projects.map(async (p) => {
      try {
        const today = new Date();
        const thirtyDaysAgo = subDays(today, 30);

        const data = await getWalletConnections({
          clientId: p.publishableKey,
          period: "all",
          from: thirtyDaysAgo,
          to: today,
        });

        let uniqueWalletsConnected = 0;
        for (const d of data) {
          uniqueWalletsConnected += d.uniqueWalletsConnected;
        }

        return {
          ...p,
          monthlyActiveUsers: uniqueWalletsConnected,
        };
      } catch {
        return {
          ...p,
          monthlyActiveUsers: 0,
        };
      }
    }),
  );
}
