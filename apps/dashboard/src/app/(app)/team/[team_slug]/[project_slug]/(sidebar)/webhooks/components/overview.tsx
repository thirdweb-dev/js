"use client";

import { redirect } from "next/navigation";
import type { WebhookSummaryStats } from "@/types/analytics";
import type {
  Topic,
  WebhookConfig,
} from "../../../../../../../../@/api/webhook-configs";
import { WebhookConfigsTable } from "./webhook-configs-table";

interface WebhooksOverviewProps {
  teamId: string;
  teamSlug: string;
  projectId: string;
  projectSlug: string;
  webhookConfigs: WebhookConfig[];
  topics: Topic[];
  metricsMap: Map<string, WebhookSummaryStats | null>;
}

export function WebhooksOverview({
  teamId,
  teamSlug,
  projectId,
  projectSlug,
  webhookConfigs,
  topics,
  metricsMap,
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
      metricsMap={metricsMap}
      projectId={projectId}
      projectSlug={projectSlug}
      teamId={teamId}
      teamSlug={teamSlug}
      topics={topics}
      webhookConfigs={webhookConfigs}
    />
  );
}
