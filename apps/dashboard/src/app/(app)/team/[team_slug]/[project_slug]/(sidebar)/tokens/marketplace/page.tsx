import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { ClientOnly } from "@/components/blocks/client-only";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { ContractTable } from "@/components/contract-components/tables/contract-table";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { getSortedDeployedContracts } from "../../../../../../account/contracts/_components/getSortedDeployedContracts";
import { AssetsHeader } from "../asset-header";
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
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/marketplace`,
    );
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
      <AssetsHeader
        teamSlug={params.team_slug}
        projectSlug={params.project_slug}
      />
      <div className="h-8" />
      <Header />
      <div className="h-4" />
      <div className="container max-w-7xl pb-20">
        <Cards
          client={client}
          projectId={project.id}
          projectSlug={params.project_slug}
          teamId={team.id}
          teamSlug={params.team_slug}
        />

        <div className="mt-10 mb-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Your Marketplaces
          </h2>
          <p className="text-muted-foreground">
            List of all marketplaces created or imported into this project
          </p>
        </div>

        <Suspense fallback={<GenericLoadingPage />}>
          <PageAsync
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

function Header() {
  return (
    <div className="container max-w-7xl">
      <h1 className="font-semibold text-2xl tracking-tight">NFT Marketplace</h1>
      <p className="text-muted-foreground">
        Create marketplaces to buy and sell the NFTs in your project.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/tokens/explore/pre-built-contracts/marketplace"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about marketplace
        </UnderlineLink>
      </p>
    </div>
  );
}

async function PageAsync(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
}) {
  const deployedContracts = await getSortedDeployedContracts({
    authToken: props.authToken,
    deploymentType: "marketplace",
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
        variant="marketplace"
      />
    </ClientOnly>
  );
}
