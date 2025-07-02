import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getAvailableTopics, getWebhookConfigs } from "@/api/webhook-configs";
import Overview from "./components/overview";

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

  // Fetch webhook configs and topics on the server
  const [webhookConfigsResult, topicsResult] = await Promise.all([
    getWebhookConfigs({
      projectIdOrSlug: resolvedParams.project_slug,
      teamIdOrSlug: resolvedParams.team_slug,
    }),
    getAvailableTopics(),
  ]);

  const webhookConfigs = webhookConfigsResult.data || [];

  return (
    <Overview
      projectSlug={resolvedParams.project_slug}
      teamSlug={resolvedParams.team_slug}
      topics={topicsResult.data || []}
      webhookConfigs={webhookConfigs}
    />
  );
}
