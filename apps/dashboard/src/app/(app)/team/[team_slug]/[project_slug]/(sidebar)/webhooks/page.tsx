import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { WebhooksOverview } from "./components/overview";

export default async function WebhooksPage({
  params,
}: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const [authToken, resolvedParams] = await Promise.all([
    getAuthToken(),
    params,
  ]);

  const project = await getProject(
    resolvedParams.team_slug,
    resolvedParams.project_slug,
  );

  if (!project || !authToken) {
    notFound();
  }

  return (
    <WebhooksOverview
      projectId={project.id}
      projectSlug={resolvedParams.project_slug}
      teamId={project.teamId}
      teamSlug={resolvedParams.team_slug}
    />
  );
}
