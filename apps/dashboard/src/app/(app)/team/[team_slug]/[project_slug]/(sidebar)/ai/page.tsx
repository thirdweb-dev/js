import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { AiAnalytics } from "./analytics/chart";
import { AiSummary } from "./analytics/chart/Summary";

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

  const { team_slug, project_slug } = params;

  const [project, authToken] = await Promise.all([
    getProject(team_slug, project_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/${project_slug}/ai`);
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  const { range, interval, defaultRange } = getFiltersFromSearchParams({
    defaultRange: "last-30" as DurationId,
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  return (
    <ResponsiveSearchParamsProvider>
      <ProjectPage
        project={project}
        header={{
          title: "AI",
          description:
            "Interact with any EVM chain with natural language",
          docsLink: "https://portal.thirdweb.com/ai/chat",
          links: [
            {
              href: "https://api.thirdweb.com/reference#tag/ai/post/ai/chat",
              label: "API Reference",
            },
            {
              href: "https://playground.thirdweb.com/ai/chat",
              label: "Playground",
            },
          ],
        }}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <ResponsiveTimeFilters defaultRange={defaultRange} />
          <AiSummary
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
            range={range}
          />

          <AiAnalytics
            interval={interval}
            projectId={project.id}
            range={range}
            teamId={project.teamId}
            authToken={authToken}
          />
        </div>
      </ProjectPage>
    </ResponsiveSearchParamsProvider>
  );
}