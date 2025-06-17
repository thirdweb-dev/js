import { ClientOnly } from "@/components/blocks/client-only";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ContractTable } from "components/contract-components/tables/contract-table";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { DeployedContractsPageHeader } from "../DeployedContractsPageHeader";
import { DeployViaCLIOrImportCard } from "./DeployViaCLIOrImportCard";
import { getSortedDeployedContracts } from "./getSortedDeployedContracts";

export function DeployedContractsPage(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <div className="flex grow flex-col">
      <DeployedContractsPageHeader
        teamId={props.teamId}
        projectId={props.projectId}
        client={props.client}
      />
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        <Suspense fallback={<Loading />}>
          <DeployedContractsPageAsync {...props} />
        </Suspense>
        <div className="h-8" />
        <DeployViaCLIOrImportCard
          client={props.client}
          teamId={props.teamId}
          projectId={props.projectId}
        />
      </div>
    </div>
  );
}

async function DeployedContractsPageAsync(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  client: ThirdwebClient;
  teamSlug: string;
  projectSlug: string;
}) {
  const deployedContracts = await getSortedDeployedContracts({
    teamId: props.teamId,
    projectId: props.projectId,
    authToken: props.authToken,
    deploymentType: undefined,
  });

  return (
    <ClientOnly ssr={<Loading />}>
      <ContractTable
        variant="contract"
        contracts={deployedContracts}
        pageSize={10}
        teamId={props.teamId}
        projectId={props.projectId}
        client={props.client}
        teamSlug={props.teamSlug}
        projectSlug={props.projectSlug}
      />
    </ClientOnly>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[300px] grow items-center justify-center rounded-lg border border-border">
      <Spinner className="size-10" />
    </div>
  );
}
