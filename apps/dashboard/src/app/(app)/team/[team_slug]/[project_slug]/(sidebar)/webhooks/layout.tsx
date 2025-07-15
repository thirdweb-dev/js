import { getValidAccount } from "@app/account/settings/getAccount";
import { isFeatureFlagEnabled } from "@/analytics/posthog-server";
import { TabPathLinks } from "@/components/ui/tabs";

export default async function WebhooksLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const account = await getValidAccount();
  const isFeatureEnabled = await isFeatureFlagEnabled({
    flagKey: "centralized-webhooks",
    accountId: account.id,
    email: account.email,
  });

  const params = await props.params;
  return (
    <div className="flex grow flex-col">
      <div className="pt-10 pb-4">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">
            Webhooks
          </h1>
          <p className="text-base text-muted-foreground">
            Create and manage webhooks to get notified about events
          </p>
        </div>
      </div>

      {isFeatureEnabled ? (
        <TabPathLinks
          links={[
            {
              exactMatch: true,
              name: "Overview",
              path: `/team/${params.team_slug}/${params.project_slug}/webhooks`,
            },
            {
              exactMatch: true,
              name: "Analytics",
              path: `/team/${params.team_slug}/${params.project_slug}/webhooks/analytics`,
            },
            {
              name: "Contracts",
              path: `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
            },
            {
              name: "Payments",
              path: `/team/${params.team_slug}/${params.project_slug}/webhooks/universal-bridge`,
            },
          ]}
          scrollableClassName="container max-w-7xl"
        />
      ) : (
        <TabPathLinks
          links={[
            {
              name: "Contracts",
              path: `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
            },
            {
              name: "Payments",
              path: `/team/${params.team_slug}/${params.project_slug}/webhooks/universal-bridge`,
            },
          ]}
          scrollableClassName="container max-w-7xl"
        />
      )}

      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        {props.children}
      </div>
      <div className="h-10" />
    </div>
  );
}
