import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { Suspense } from "react";
import { ContractTable } from "../../../../components/contract-components/tables/contract-table";
import { DeployedContractsPageHeader } from "../DeployedContractsPageHeader";
import { GetStartedWithContractsDeploy } from "./GetStartedWithContractsDeploy";
import { getSortedDeployedContracts } from "./getSortedDeployedContracts";

export function DeployedContractsPage(props: {
  teamId: string;
  projectId: string;
  authToken: string;
}) {
  return (
    <div className="flex grow flex-col">
      <DeployedContractsPageHeader
        teamId={props.teamId}
        projectId={props.projectId}
      />
      <div className="flex grow flex-col">
        <Suspense fallback={<Loading />}>
          <DeployedContractsPageAsync {...props} />
        </Suspense>
      </div>
    </div>
  );
}

async function DeployedContractsPageAsync(props: {
  teamId: string;
  projectId: string;
  authToken: string;
}) {
  const deployedContracts = await getSortedDeployedContracts({
    teamId: props.teamId,
    projectId: props.projectId,
    authToken: props.authToken,
  });

  if (deployedContracts.length === 0) {
    return (
      <GetStartedWithContractsDeploy
        teamId={props.teamId}
        projectId={props.projectId}
      />
    );
  }

  return (
    <ClientOnly ssr={<Loading />}>
      <ContractTable
        contracts={deployedContracts}
        pageSize={10}
        teamId={props.teamId}
        projectId={props.projectId}
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
