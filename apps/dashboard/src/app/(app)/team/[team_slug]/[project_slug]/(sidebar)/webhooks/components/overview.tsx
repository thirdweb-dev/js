"use client";

import { redirect } from "next/navigation";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { useAvailableTopics } from "../hooks/use-available-topics";
import { useWebhookConfigs } from "../hooks/use-webhook-configs";
import { WebhookConfigsTable } from "./webhook-configs-table";

interface WebhooksOverviewProps {
  teamId: string;
  teamSlug: string;
  projectId: string;
  projectSlug: string;
}

export function WebhooksOverview({
  teamId,
  teamSlug,
  projectId,
  projectSlug,
}: WebhooksOverviewProps) {
  // Feature is enabled (matches server component behavior)
  const isFeatureEnabled = true;

  const webhookConfigsQuery = useWebhookConfigs({
    enabled: isFeatureEnabled,
    projectSlug,
    teamSlug,
  });
  const topicsQuery = useAvailableTopics({ enabled: isFeatureEnabled });

  // Redirect to contracts tab if feature is disabled
  if (!isFeatureEnabled) {
    redirect(`/team/${teamSlug}/${projectSlug}/webhooks/contracts`);
  }

  // Show loading while data is loading
  if (webhookConfigsQuery.isPending || topicsQuery.isPending) {
    return <GenericLoadingPage />;
  }

  // Show error state
  if (webhookConfigsQuery.error || topicsQuery.error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">
          Failed to load webhook data. Please try again.
        </p>
      </div>
    );
  }

  // Show full webhook functionality
  return (
    <WebhookConfigsTable
      projectId={projectId}
      projectSlug={projectSlug}
      teamId={teamId}
      teamSlug={teamSlug}
      topics={topicsQuery.data || []}
      webhookConfigs={webhookConfigsQuery.data || []}
    />
  );
}
