import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { InAppWalletUsersPageContent } from "@/components/in-app-wallet-users-content/in-app-wallet-users-content";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { InAppWalletAnalytics } from "./analytics/chart";
import { InAppWalletsSummary } from "./analytics/chart/Summary";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
  }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const authToken = await getAuthToken();
  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/wallets`);
  }

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange,
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <ProjectPage
        header={{
          client,
          title: "Wallets",
          description: (
            <>
              Create wallets for your users with flexible authentication
              options.
              <br className="max-sm:hidden" /> Choose from email/phone
              verification, OAuth, passkeys, or external wallet connections
            </>
          ),
          actions: {
            primary: {
              label: "Documentation",
              href: "https://portal.thirdweb.com/wallets",
              external: true,
            },
            secondary: {
              label: "API Reference",
              href: "https://api.thirdweb.com/reference#tag/wallets",
              external: true,
            },
          },
          links: [
            {
              type: "docs",
              href: "https://portal.thirdweb.com/wallets",
            },
            {
              type: "playground",
              href: "https://playground.thirdweb.com/wallets/in-app-wallet",
            },
            {
              type: "api",
              href: "https://api.thirdweb.com/reference#tag/wallets",
            },
            {
              type: "settings",
              href: `/team/${params.team_slug}/${params.project_slug}/settings/wallets`,
            },
          ],
        }}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <ResponsiveTimeFilters defaultRange={defaultRange} />
          <InAppWalletsSummary
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
            range={range}
          />

          <InAppWalletAnalytics
            interval={interval}
            projectId={project.id}
            range={range}
            teamId={project.teamId}
            authToken={authToken}
          />

          <InAppWalletUsersPageContent
            authToken={authToken}
            client={client}
            projectClientId={project.publishableKey}
            teamId={project.teamId}
          />
        </div>
      </ProjectPage>
    </ResponsiveSearchParamsProvider>
  );
}
