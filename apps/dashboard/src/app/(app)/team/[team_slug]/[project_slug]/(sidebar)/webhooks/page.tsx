import { notFound, redirect } from "next/navigation";
import { isFeatureFlagEnabled } from "@/analytics/posthog-server";
import { getValidAccount } from "@/api/account/get-account";
import { getWebhookSummary } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getSupportedWebhookChains } from "@/api/insight/webhooks";
import { getProject } from "@/api/project/projects";
import {
  getAvailableTopics,
  getWebhookConfigs,
} from "@/api/project/webhook-configs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
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

  // Fetch webhook configs, topics, and supported chains in parallel
  const [webhookConfigsResult, topicsResult, supportedChainsResult] =
    await Promise.all([
      getWebhookConfigs({
        projectIdOrSlug: params.project_slug,
        teamIdOrSlug: params.team_slug,
      }),
      getAvailableTopics(),
      getSupportedWebhookChains(),
    ]);

  if (
    webhookConfigsResult.status === "error" ||
    topicsResult.status === "error"
  ) {
    notFound();
  }

  const webhookConfigs = webhookConfigsResult.data || [];
  const topics = topicsResult.data || [];

  // Get supported chain IDs
  let supportedChainIds: number[] = [];
  if ("chains" in supportedChainsResult) {
    supportedChainIds = supportedChainsResult.chains;
  }

  // Create client
  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  // Fetch metrics for all webhooks in parallel
  const webhookMetrics = await Promise.all(
    webhookConfigs.map(async (config) => {
      const metricsResult = await getWebhookSummary(
        {
          from: new Date(Date.now() - 24 * 60 * 60 * 1000),
          period: "day",
          projectId: project.id,
          teamId: project.teamId, // 24 hours ago
          to: new Date(),
          webhookId: config.id,
        },
        authToken,
      );

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
      client={client}
      metricsMap={metricsMap}
      projectId={project.id}
      projectSlug={params.project_slug}
      supportedChainIds={supportedChainIds}
      teamId={project.teamId}
      teamSlug={params.team_slug}
      topics={topics}
      webhookConfigs={webhookConfigs}
    />
  );
}
