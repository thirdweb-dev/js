import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { DedicatedRelayerPageClient } from "./components/page-client";
import { getFleet } from "./lib/api";

export const dynamic = "force-dynamic";

export default async function DedicatedRelayerPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const basePath = `/team/${params.team_slug}/${params.project_slug}/wallets/dedicated-relayer`;

  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(basePath);
  }

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  // Fetch fleet data from the bundler service on the project
  const fleet = await getFleet({
    teamId: project.teamId,
    projectId: project.id,
    authToken,
  });

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <DedicatedRelayerPageClient
      authToken={authToken}
      client={client}
      initialFleet={fleet}
      project={project}
      projectSlug={params.project_slug}
      teamSlug={params.team_slug}
    />
  );
}
