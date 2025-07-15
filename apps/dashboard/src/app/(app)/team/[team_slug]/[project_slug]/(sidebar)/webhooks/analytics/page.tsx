import { notFound, redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { isFeatureFlagEnabled } from "@/analytics/posthog-server";
import { getWebhookLatency, getWebhookRequests } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getWebhookConfigs } from "@/api/webhook-configs";
import { getFiltersFromSearchParams } from "@/lib/time";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { WebhooksAnalytics } from "./components/WebhooksAnalytics";

export default async function WebhooksAnalyticsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
    webhook?: string | undefined | string[];
  }>;
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

  if (!project) {
    notFound();
  }

  if (!isFeatureEnabled) {
    redirect(
      `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
    );
  }

  const searchParams = await props.searchParams;
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: "last-7",
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  // Get webhook configs
  const webhookConfigsResponse = await getWebhookConfigs({
    projectIdOrSlug: params.project_slug,
    teamIdOrSlug: params.team_slug,
  }).catch(() => ({
    body: "",
    data: [],
    reason: "Failed to fetch webhook configs",
    status: "error" as const,
  }));

  if (
    webhookConfigsResponse.status === "error" ||
    webhookConfigsResponse.data.length === 0
  ) {
    return (
      <ResponsiveSearchParamsProvider value={searchParams}>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">
            No webhook configurations found.
          </p>
        </div>
      </ResponsiveSearchParamsProvider>
    );
  }

  // Get selected webhook ID from search params
  const selectedWebhookId = Array.isArray(searchParams.webhook)
    ? searchParams.webhook[0] || "all"
    : searchParams.webhook || "all";

  // Fetch webhook analytics data
  const webhookId = selectedWebhookId === "all" ? undefined : selectedWebhookId;
  const [requestsData, latencyData] = await Promise.all([
    (async () => {
      const res = await getWebhookRequests({
        from: range.from,
        period: interval,
        projectId: project.id,
        teamId: project.teamId,
        to: range.to,
        webhookId,
      });
      if ("error" in res) {
        console.error("Failed to fetch webhook requests:", res.error);
        return [];
      }
      return res.data;
    })(),
    (async () => {
      const res = await getWebhookLatency({
        from: range.from,
        period: interval,
        projectId: project.id,
        teamId: project.teamId,
        to: range.to,
        webhookId,
      });
      if ("error" in res) {
        console.error("Failed to fetch webhook latency:", res.error);
        return [];
      }
      return res.data;
    })(),
  ]);

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <WebhooksAnalytics
        latencyData={latencyData}
        requestsData={requestsData}
        selectedWebhookId={selectedWebhookId}
        webhookConfigs={webhookConfigsResponse.data}
      />
    </ResponsiveSearchParamsProvider>
  );
}
