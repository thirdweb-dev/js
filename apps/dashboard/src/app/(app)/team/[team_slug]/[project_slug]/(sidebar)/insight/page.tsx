import { ArrowUpRightIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { InsightIcon } from "@/icons/InsightIcon";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { InsightAnalytics } from "./components/InsightAnalytics";

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
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/insight`);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const searchParams = await props.searchParams;
  const { range, interval } = getFiltersFromSearchParams({
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
        icon: InsightIcon,
        title: "Insight",
        description:
          "APIs to retrieve blockchain data from any EVM chain, enrich it with metadata, and transform it using custom logic.",
        actions: null,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/insight",
          },
          {
            type: "playground",
            href: "https://playground.thirdweb.com/insight",
          },
          {
            type: "api",
            href: "https://insight-api.thirdweb.com/reference",
          },
          {
            type: "webhooks",
            href: `/team/${params.team_slug}/${params.project_slug}/webhooks/contracts`,
          },
        ],
      }}
      footer={{
        center: {
          links: [
            {
              href: "https://www.youtube.com/watch?v=U2aW7YIUJVw",
              label:
                "Blockchain Data on Any EVM - Quick and Easy REST APIs for Onchain Data",
            },
            {
              href: "https://www.youtube.com/watch?v=HvqewXLVRig",
              label: "Build a Whale Alerts Telegram Bot with Insight",
            },
          ],
          title: "Tutorials",
        },
        left: {
          links: [
            {
              href: "https://portal.thirdweb.com/insight",
              label: "Overview",
            },
            {
              href: "https://insight-api.thirdweb.com/reference",
              label: "API Reference",
            },
          ],
          title: "Documentation",
        },
        right: {
          links: [
            {
              href: "https://playground.thirdweb.com/insight",
              label: "API Playground",
            },
          ],
          title: "Demos",
        },
      }}
    >
      <ResponsiveSearchParamsProvider value={searchParams}>
        <div>
          <InsightAnalytics
            client={client}
            interval={interval}
            projectClientId={project.publishableKey}
            projectId={project.id}
            range={range}
            teamId={project.teamId}
            authToken={authToken}
          />

          <div className="h-10" />
          <div className="relative overflow-hidden rounded-lg border-2 border-green-500/20 bg-gradient-to-br from-card/80 to-card/50 p-4 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg">
                  Get Started with Insight
                </h3>
                <p className="text-muted-foreground text-sm">
                  A cross-chain API for historic blockchain data.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-medium text-sm text-white transition-all hover:bg-green-600/90 hover:shadow-sm"
                href="https://portal.thirdweb.com/insight"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn More
                <ArrowUpRightIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </ResponsiveSearchParamsProvider>
    </ProjectPage>
  );
}
