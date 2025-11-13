import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { PayAnalytics } from "../payments/components/PayAnalytics";
import { getUniversalBridgeFiltersFromSearchParams } from "../payments/components/time";
import { QuickStartSection } from "./QuickstartSection.client";

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

      <div className="pt-4">
        <QuickStartSection
          projectSlug={params.project_slug}
          teamSlug={params.team_slug}
          clientId={project.publishableKey}
          teamId={project.teamId}
        />
      </div>
    </div>
  );
}
