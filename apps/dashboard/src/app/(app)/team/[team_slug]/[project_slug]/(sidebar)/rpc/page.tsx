import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { RPCAnalytics } from "./components/RpcAnalytics";

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
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/rpc`);
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
        title: "RPC",
        description:
          "Remote Procedure Call (RPC) provides reliable access to querying data and interacting with the blockchain through global edge RPCs.",
        actions: {
          primary: {
            label: "Documentation",
            href: "https://portal.thirdweb.com/infrastructure/rpc-edge/overview",
            external: true,
          },
        },
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/infrastructure/rpc-edge/overview",
          },
        ],
      }}
    >
      <ResponsiveSearchParamsProvider value={searchParams}>
        <div>
          <RPCAnalytics
            client={client}
            interval={interval}
            projectClientId={project.publishableKey}
            projectId={project.id}
            range={range}
            authToken={authToken}
            teamId={project.teamId}
          />
          <div className="h-10" />
        </div>
      </ResponsiveSearchParamsProvider>
    </ProjectPage>
  );
}
