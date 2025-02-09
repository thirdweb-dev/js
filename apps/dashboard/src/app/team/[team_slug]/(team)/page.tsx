import { getWalletConnections } from "@/api/analytics";
import { getProjectsForAuthToken } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { projectsCacheTag } from "@/constants/cacheTags";
import { Changelog } from "components/dashboard/Changelog";
import { subDays } from "date-fns";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";
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

  const getCachedProjectsWithAnalytics = unstable_cache(
    getProjectsWithAnalytics,
    ["getProjectsWithAnalytics"],
    {
      revalidate: 3600, // 1 hour,
      tags: [projectsCacheTag(authToken)],
    },
  );

  const projectsWithTotalWallets = await getCachedProjectsWithAnalytics(
    authToken,
    params.team_slug,
  );

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
  authToken: string,
  teamSlug: string,
): Promise<Array<ProjectWithAnalytics>> {
  console.log("FETCHING PROJECTS WITH ANALYTICS -------------", teamSlug);
  const projects = await getProjectsForAuthToken(authToken, teamSlug);

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
