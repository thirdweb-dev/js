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
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/gateway/indexer`,
    );
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
        title: "Indexer",
        description:
          "Indexed data for EVM chains, available automatically via the thirdweb SDKs and API.",
        actions: null,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/contracts/events",
          },
          {
            type: "api",
            href: "https://portal.thirdweb.com/reference",
          },
        ],
      }}
    >
      <ResponsiveSearchParamsProvider value={searchParams}>
        <InsightAnalytics
          client={client}
          interval={interval}
          projectClientId={project.publishableKey}
          projectId={project.id}
          range={range}
          teamId={project.teamId}
          authToken={authToken}
        />
      </ResponsiveSearchParamsProvider>
    </ProjectPage>
  );
}
