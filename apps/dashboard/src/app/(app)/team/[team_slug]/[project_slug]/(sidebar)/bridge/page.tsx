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
        links: [
          // TODO - add docs when bridge docs are added in portal
          // {
          // 	type: "docs",
          // 	href: "https://portal.thirdweb.com/payments",
          // },
          {
            type: "api",
            href: "https://api.thirdweb.com/reference#tag/bridge",
          },
        ],
      }}
      footer={{
        center: {
          links: [
            {
              href: "https://playground.thirdweb.com/payments/ui-components",
              label: "UI Component",
            },
            {
              href: "https://playground.thirdweb.com/connect/payments/fund-wallet",
              label: "Buy Crypto",
            },
            {
              href: "https://playground.thirdweb.com/connect/payments/commerce",
              label: "Checkout",
            },
            {
              href: "https://playground.thirdweb.com/connect/payments/transactions",
              label: "Transactions",
            },
          ],
          title: "Demos",
        },
        left: {
          links: [
            {
              href: "https://portal.thirdweb.com/payments",
              label: "Overview",
            },
            {
              href: "https://portal.thirdweb.com/typescript/v5/convertCryptoToFiat",
              label: "TypeScript",
            },
            {
              href: "https://portal.thirdweb.com/react/v5/pay/fund-wallets",
              label: "React",
            },
            {
              href: "https://portal.thirdweb.com/dotnet/universal-bridge/quickstart",
              label: ".NET",
            },
          ],
          title: "Documentation",
        },
        right: {
          links: [
            {
              href: "https://www.youtube.com/watch?v=aBu175-VsNY",
              label: "Implement cross-chain payments in any app",
            },
          ],
          title: "Tutorials",
        },
      }}
    >
      <div className="flex flex-col gap-12">
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

        <QuickStartSection
          projectSlug={params.project_slug}
          teamSlug={params.team_slug}
          clientId={project.publishableKey}
          teamId={project.teamId}
        />
      </div>
    </ProjectPage>
  );
}
