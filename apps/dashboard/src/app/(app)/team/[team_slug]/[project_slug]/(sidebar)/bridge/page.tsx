import { WebhookIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { loginRedirect } from "@/utils/redirects";
import { PayAnalytics } from "../payments/components/PayAnalytics";
import { getUniversalBridgeFiltersFromSearchParams } from "../payments/components/time";
import { QuickStartSection } from "./QuickstartSection.client";
import { RouteDiscovery } from "./RouteDiscovery";
import { ViewTxStatus } from "./view-tx-status";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  searchParams: Promise<{
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  }>;
}) {
  const [params, authToken] = await Promise.all([props.params, getAuthToken()]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/bridge`);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const searchParams = await props.searchParams;

  const { range, interval } = getUniversalBridgeFiltersFromSearchParams({
    defaultRange: "last-30",
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ProjectPage
      header={{
        client,
        title: "Bridge",
        icon: BridgeIcon,
        description: (
          <>
            Bridge lets developers swap and transfer any token across any chain
            instantly
          </>
        ),
        actions: {
          secondary: {
            href: `/team/${params.team_slug}/${params.project_slug}/webhooks/payments`,
            label: "Webhooks",
            icon: <WebhookIcon className="size-3.5 text-muted-foreground" />,
          },
        },
        settings: {
          href: `/team/${params.team_slug}/${params.project_slug}/settings/payments`,
        },
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/bridge",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/bridge/swap-widget",
          },
          {
            type: "api",
            href: "https://api.thirdweb.com/reference#tag/bridge",
          },
        ],
      }}
    >
      <div className="flex flex-col gap-6">
        <ResponsiveSearchParamsProvider value={searchParams}>
          <PayAnalytics
            client={client}
            interval={interval}
            projectClientId={project.publishableKey}
            projectId={project.id}
            range={range}
            teamId={project.teamId}
            authToken={authToken}
          />
        </ResponsiveSearchParamsProvider>

        <RouteDiscovery client={client} project={project} />

        <ViewTxStatus client={client} />

        <div className="pt-4">
          <QuickStartSection
            projectSlug={params.project_slug}
            teamSlug={params.team_slug}
            clientId={project.publishableKey}
            teamId={project.teamId}
          />
        </div>
      </div>
    </ProjectPage>
  );
}
