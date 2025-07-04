import { TabPathLinks } from "@/components/ui/tabs";

export default async function WebhooksLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  // Enabled on dev or if FF is enabled.
  // In server components, we default to true since posthog is client-side only
  const isFeatureEnabled = true;

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

      <TabPathLinks
        links={[
          ...(isFeatureEnabled
            ? [
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
              ]
            : []),
          {
            name: "Contracts",
            path: `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
          },
          {
            name: "Universal Bridge",
            path: `/team/${params.team_slug}/${params.project_slug}/webhooks/universal-bridge`,
          },
        ]}
        scrollableClassName="container max-w-7xl"
      />
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        {props.children}
      </div>
      <div className="h-10" />
    </div>
  );
}
