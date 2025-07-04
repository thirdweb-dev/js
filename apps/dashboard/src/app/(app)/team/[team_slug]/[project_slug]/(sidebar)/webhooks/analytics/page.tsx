import { notFound } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getFiltersFromSearchParams } from "@/lib/time";
import { WebhooksAnalytics } from "./components/WebhooksAnalytics";

export default async function WebhooksAnalyticsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  }>;
}) {
  const [authToken, params] = await Promise.all([getAuthToken(), props.params]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project || !authToken) {
    notFound();
  }

  const searchParams = await props.searchParams;
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: "last-7",
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <WebhooksAnalytics
        interval={interval}
        projectId={project.id}
        projectSlug={params.project_slug}
        range={range}
        teamId={project.teamId}
        teamSlug={params.team_slug}
      />
    </ResponsiveSearchParamsProvider>
  );
}
