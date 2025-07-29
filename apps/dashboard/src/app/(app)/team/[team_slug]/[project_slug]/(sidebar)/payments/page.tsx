import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { AdvancedSection } from "./components/AdvancedSection.client";
import { QuickStartSection } from "./components/QuickstartSection.client";
import { RecentPaymentsSection } from "./components/RecentPaymentsSection.client";

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
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/payments`);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const searchParams = await props.searchParams;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <main>
        <RecentPaymentsSection
          client={client}
          projectClientId={project.publishableKey}
          teamId={project.teamId}
        />
        <div className="h-12" />
        <QuickStartSection
          projectSlug={params.project_slug}
          teamSlug={params.team_slug}
        />
        <div className="h-12" />
        <AdvancedSection
          projectSlug={params.project_slug}
          teamSlug={params.team_slug}
        />
      </main>
    </ResponsiveSearchParamsProvider>
  );
}
