import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { Suspense } from "react";
import { DeployedContractsPageHeader } from "../DeployedContractsPageHeader";
import { DeployedContractsTable } from "./DeployedContractsTable";
import { GetStartedWithContractsDeploy } from "./GetStartedWithContractsDeploy";
import { getSortedDeployedContracts } from "./getSortedDeployedContracts";

export function DeployedContractsPage(props: {
  address: string;
  className?: string;
}) {
  return (
    <div className={props.className}>
      <DeployedContractsPageHeader />
      <div className="h-6" />
      <Suspense fallback={<Loading />}>
        <DeployedContractsPageAsync {...props} />
      </Suspense>
    </div>
  );
}

async function DeployedContractsPageAsync(props: {
  address: string;
}) {
  const deployedContracts = await getSortedDeployedContracts({
    address: props.address,
  });

  if (deployedContracts.length === 0) {
    return <GetStartedWithContractsDeploy />;
  }

  return (
    <ClientOnly ssr={<Loading />}>
      <DeployedContractsTable contracts={deployedContracts} />
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
