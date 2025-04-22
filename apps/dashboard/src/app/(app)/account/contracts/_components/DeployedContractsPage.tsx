import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
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
}) {
  return (
    <div className="flex grow flex-col">
      <DeployedContractsPageHeader
        teamId={props.teamId}
        projectId={props.projectId}
      />
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col">
        <Suspense fallback={<Loading />}>
          <DeployedContractsPageAsync {...props} />
        </Suspense>
        <div className="h-8" />
        <DeployViaCLIOrImportCard
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
}) {
  const deployedContracts = await getSortedDeployedContracts({
    teamId: props.teamId,
    projectId: props.projectId,
    authToken: props.authToken,
  });

  return (
    <ClientOnly ssr={<Loading />}>
      <ContractTable
        contracts={deployedContracts}
        pageSize={10}
        teamId={props.teamId}
        projectId={props.projectId}
        client={props.client}
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
