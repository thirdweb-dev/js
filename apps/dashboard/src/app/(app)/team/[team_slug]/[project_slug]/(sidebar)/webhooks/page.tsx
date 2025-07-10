import { notFound, redirect } from "next/navigation";
import { isFeatureFlagEnabled } from "@/analytics/posthog-server";
import { getWebhookSummary } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getAvailableTopics, getWebhookConfigs } from "@/api/webhook-configs";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { WebhooksOverview } from "./components/overview";

export default async function WebhooksPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const [authToken, params, account] = await Promise.all([
    getAuthToken(),
    props.params,
    getValidAccount(),
  ]);

  if (!account || !authToken) {
    notFound();
  }

  const [isFeatureEnabled, project] = await Promise.all([
    isFeatureFlagEnabled({
      flagKey: "centralized-webhooks",
      accountId: account.id,
      email: account.email,
    }),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!project || !authToken) {
    notFound();
  }

  if (!isFeatureEnabled) {
    redirect(
      `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
    );
  }

  // Fetch webhook configs and topics in parallel
  const [webhookConfigsResult, topicsResult] = await Promise.all([
    getWebhookConfigs({
      projectIdOrSlug: params.project_slug,
      teamIdOrSlug: params.team_slug,
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
      projectSlug={params.project_slug}
      teamId={project.teamId}
      teamSlug={params.team_slug}
      topics={topics}
      webhookConfigs={webhookConfigs}
    />
  );
}
