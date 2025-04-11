import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { TransactionsAnalyticsPageContent } from "./analytics/analytics-page";
import { TransactionAnalyticsSummary } from "./analytics/summary";

export default async function TransactionsAnalyticsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string | string[] | undefined;
    to?: string | string[] | undefined;
    interval?: string | string[] | undefined;
  }>;
}) {
  const [params, searchParams, authToken] = await Promise.all([
    props.params,
    props.searchParams,
    getAuthToken(),
  ]);

  if (!authToken) {
    notFound();
  }

  const [team, project] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="flex grow flex-col">
      <TransactionAnalyticsSummary
        teamId={project.teamId}
        projectId={project.id}
      />
      <div className="h-10" />
      <TransactionsAnalyticsPageContent
        searchParams={searchParams}
        teamId={project.teamId}
        clientId={project.publishableKey}
        project_slug={params.project_slug}
        team_slug={params.team_slug}
      />
    </div>
  );
}
