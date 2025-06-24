import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { AnalyticsPageContent } from "./analytics/analytics-page";

export default async function WebhooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [authToken, resolvedParams, resolvedSearchParams] = await Promise.all([
    getAuthToken(),
    params,
    searchParams,
  ]);

  const project = await getProject(
    resolvedParams.team_slug,
    resolvedParams.project_slug,
  );

  if (!project || !authToken) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-0.5 font-semibold text-xl tracking-tight">Analytics</h2>
      <p className="text-muted-foreground text-sm">
        Review your webhooks usage and errors.
      </p>
      <div className="h-6" />
      <AnalyticsPageContent
        project={project}
        searchParams={resolvedSearchParams}
        teamSlug={resolvedParams.team_slug}
      />
    </div>
  );
}
