import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { getAuthToken } from "@/api/auth-token";
import { getFilteredProjectContracts } from "@/api/project/getSortedDeployedContracts";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { ContractTable } from "@/components/contract-components/tables/contract-table";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);
  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/tokens`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <Suspense fallback={<GenericLoadingPage />}>
      <AssetsPageAsync
        authToken={authToken}
        client={client}
        projectId={project.id}
        projectSlug={params.project_slug}
        teamId={team.id}
        teamSlug={params.team_slug}
      />
    </Suspense>
  );
}

async function AssetsPageAsync(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
}) {
  const deployedContracts = await getFilteredProjectContracts({
    authToken: props.authToken,
    type: "token-contracts",
    projectId: props.projectId,
    teamId: props.teamId,
  });

  return (
    <ClientOnly ssr={<GenericLoadingPage />}>
      <ContractTable
        client={props.client}
        contracts={deployedContracts}
        pageSize={10}
        projectId={props.projectId}
        projectSlug={props.projectSlug}
        teamId={props.teamId}
        teamSlug={props.teamSlug}
        variant="asset"
      />
    </ClientOnly>
  );
}
