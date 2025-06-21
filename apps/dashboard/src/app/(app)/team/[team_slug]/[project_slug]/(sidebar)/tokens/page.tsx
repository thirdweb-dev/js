import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { ContractTable } from "../../../../../../../components/contract-components/tables/contract-table";
import { getSortedDeployedContracts } from "../../../../../account/contracts/_components/getSortedDeployedContracts";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { Cards } from "./cards";

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
    <div className="flex grow flex-col">
      <AssetsHeader />
      <div className="container max-w-7xl pt-8 pb-20">
        <Cards
          client={client}
          projectId={project.id}
          projectSlug={params.project_slug}
          teamId={team.id}
          teamSlug={params.team_slug}
        />

        <div className="mt-10 mb-3">
          <h2 className="font-semibold text-2xl tracking-tight">Your Tokens</h2>
          <p className="text-muted-foreground">
            List of all tokens created or imported into this project
          </p>
        </div>

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
      </div>
    </div>
  );
}

function AssetsHeader() {
  return (
    <div className="border-b">
      <div className="container max-w-7xl py-10">
        <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
          Tokens
        </h1>
        <p className="text-muted-foreground">
          Create and Manage tokens for your project
        </p>
      </div>
    </div>
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
  const deployedContracts = await getSortedDeployedContracts({
    authToken: props.authToken,
    deploymentType: "asset",
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
