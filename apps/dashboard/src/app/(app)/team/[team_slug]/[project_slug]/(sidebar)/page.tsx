import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { isProjectActive } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { ProjectAvatar } from "@/components/blocks/avatar/project-avatar";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getProjectWallet } from "@/lib/server/project-wallet";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { ProjectAnalytics } from "./_analytics/project-analytics";
import type { PageParams, PageSearchParams } from "./_analytics/types";
import { ProjectFTUX } from "./components/ProjectFTUX/ProjectFTUX";
import { ProjectWalletSection } from "./components/project-wallet/project-wallet";

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

export default async function ProjectOverviewPage(props: PageProps) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}`);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: "last-30",
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  const activeStatus = await isProjectActive({
    authToken,
    projectId: project.id,
    teamId: project.teamId,
  });

  const isActive = Object.values(activeStatus).some((v) => !!v);

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  const projectWallet = await getProjectWallet(project);

  return (
    <ProjectPage
      header={{
        client,
        isProjectIcon: true,
        icon: () => (
          <ProjectAvatar
            className="size-11"
            client={client}
            src={project.image ?? ""}
          />
        ),
        title: project.name,
        description: "Your project's overview and analytics",
        // explicitly NO actions on the overview page
        actions: null,
      }}
    >
      {isActive ? (
        <ResponsiveSearchParamsProvider value={searchParams}>
          <div className="flex flex-col gap-4 md:gap-10">
            <ProjectWalletSection
              project={project}
              teamSlug={params.team_slug}
              projectWallet={projectWallet}
              client={client}
              layout="column"
            />
            <div className="flex flex-col gap-4">
              <ResponsiveTimeFilters defaultRange={defaultRange} />
              <ProjectAnalytics
                authToken={authToken}
                client={client}
                interval={interval}
                params={params}
                project={project}
                range={range}
                searchParams={searchParams}
              />
            </div>
          </div>
        </ResponsiveSearchParamsProvider>
      ) : (
        <div className="pt-6">
          <ProjectFTUX
            project={project}
            teamSlug={params.team_slug}
            projectWalletSection={
              <ProjectWalletSection
                project={project}
                teamSlug={params.team_slug}
                projectWallet={projectWallet}
                client={client}
                layout="row"
              />
            }
          />
        </div>
      )}
    </ProjectPage>
  );
}
