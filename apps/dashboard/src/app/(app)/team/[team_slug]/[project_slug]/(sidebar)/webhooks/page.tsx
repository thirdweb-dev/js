import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getWebhookSummary } from "../../../../../../../@/api/analytics";
import {
  getAvailableTopics,
  getWebhookConfigs,
} from "../../../../../../../@/api/webhook-configs";
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

  // Fetch webhook configs and topics in parallel
  const [webhookConfigsResult, topicsResult] = await Promise.all([
    getWebhookConfigs({
      projectIdOrSlug: resolvedParams.project_slug,
      teamIdOrSlug: resolvedParams.team_slug,
    }),
    getAvailableTopics(),
  ]);

  if (
    webhookConfigsResult.status === "error" ||
    topicsResult.status === "error"
  ) {
    notFound();
  }

  const webhookConfigs = webhookConfigsResult.data || [];
  const topics = topicsResult.data || [];

  // Fetch metrics for all webhooks in parallel
  const webhookMetrics = await Promise.all(
    webhookConfigs.map(async (config) => {
      const metricsResult = await getWebhookSummary({
        from: new Date(Date.now() - 24 * 60 * 60 * 1000),
        period: "day",
        projectId: project.id,
        teamId: project.teamId, // 24 hours ago
        to: new Date(),
        webhookId: config.id,
      });

      return {
        metrics:
          "error" in metricsResult ? null : (metricsResult.data[0] ?? null),
        webhookId: config.id,
      };
    }),
  );

  // Create a map for easy lookup
  const metricsMap = new Map(
    webhookMetrics.map((item) => [item.webhookId, item.metrics]),
  );

  return (
    <WebhooksOverview
      metricsMap={metricsMap}
      projectId={project.id}
      projectSlug={resolvedParams.project_slug}
      teamId={project.teamId}
      teamSlug={resolvedParams.team_slug}
      topics={topics}
      webhookConfigs={webhookConfigs}
    />
  );
}
