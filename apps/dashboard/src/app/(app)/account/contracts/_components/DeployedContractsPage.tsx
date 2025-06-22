import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { ClientOnly } from "@/components/blocks/client-only";
import { ContractTable } from "@/components/contract-components/tables/contract-table";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
    <div className="container flex max-w-7xl grow flex-col">
      <Suspense fallback={<Loading />}>
        <DeployedContractsPageAsync {...props} />
      </Suspense>
      <div className="h-8" />
      <DeployViaCLIOrImportCard
        client={props.client}
        projectId={props.projectId}
        teamId={props.teamId}
      />
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
    authToken: props.authToken,
    deploymentType: undefined,
    projectId: props.projectId,
    teamId: props.teamId,
  });

  return (
    <ClientOnly ssr={<Loading />}>
      <ContractTable
        client={props.client}
        contracts={deployedContracts}
        pageSize={10}
        projectId={props.projectId}
        projectSlug={props.projectSlug}
        teamId={props.teamId}
        teamSlug={props.teamSlug}
        variant="contract"
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
