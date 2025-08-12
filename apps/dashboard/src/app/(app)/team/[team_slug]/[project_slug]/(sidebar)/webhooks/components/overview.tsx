"use client";

import { redirect } from "next/navigation";
import type { ThirdwebClient } from "thirdweb";
import type { Topic, WebhookConfig } from "@/api/project/webhook-configs";
import type { WebhookSummaryStats } from "@/types/analytics";
import { WebhookConfigsTable } from "./webhook-configs-table";

interface WebhooksOverviewProps {
  teamId: string;
  teamSlug: string;
  projectId: string;
  projectSlug: string;
  webhookConfigs: WebhookConfig[];
  topics: Topic[];
  metricsMap: Map<string, WebhookSummaryStats | null>;
  client?: ThirdwebClient;
  supportedChainIds?: Array<number>;
}

export function WebhooksOverview({
  teamId,
  teamSlug,
  projectId,
  projectSlug,
  webhookConfigs,
  topics,
  metricsMap,
  client,
  supportedChainIds,
}: WebhooksOverviewProps) {
  // Feature is enabled (matches server component behavior)
  const isFeatureEnabled = true;

  // Redirect to contracts tab if feature is disabled
  if (!isFeatureEnabled) {
    redirect(`/team/${teamSlug}/${projectSlug}/webhooks/contracts`);
  }

  // Show full webhook functionality
  return (
    <WebhookConfigsTable
      client={client}
      metricsMap={metricsMap}
      projectId={projectId}
      projectSlug={projectSlug}
      supportedChainIds={supportedChainIds}
      teamId={teamId}
      teamSlug={teamSlug}
      topics={topics}
      webhookConfigs={webhookConfigs}
    />
  );
}
