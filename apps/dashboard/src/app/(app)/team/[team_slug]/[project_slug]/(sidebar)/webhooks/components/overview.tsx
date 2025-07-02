"use client";

import type { Topic, WebhookConfig } from "@/api/webhook-configs";
import { WebhookConfigsTable } from "./webhook-configs-table";

interface OverviewProps {
  teamSlug: string;
  projectSlug: string;
  webhookConfigs: WebhookConfig[];
  topics: Topic[];
}

export default function Overview({
  teamSlug,
  projectSlug,
  webhookConfigs,
  topics,
}: OverviewProps) {
  return (
    <WebhookConfigsTable
      projectSlug={projectSlug}
      teamSlug={teamSlug}
      topics={topics}
      webhookConfigs={webhookConfigs}
    />
  );
}
