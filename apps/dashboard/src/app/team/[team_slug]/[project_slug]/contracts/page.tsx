"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAllContractList } from "@3rdweb-sdk/react/hooks/useRegistry";
import { useActiveAccount } from "thirdweb/react";
import { DeployedContracts } from "../../../../../components/contract-components/tables/deployed-contracts";
import { GetStartedWithContractsDeploy } from "./_components/GetStartedWithContractsDeploy";

export default function Page() {
  const address = useActiveAccount()?.address;
  const deployedContracts = useAllContractList(address);
  const hasContracts =
    deployedContracts.data && deployedContracts.data?.length > 0;

  if (deployedContracts.isLoading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="pb-10 pt-6">
      {!hasContracts ? (
        <GetStartedWithContractsDeploy />
      ) : (
        <DeployedContracts contractListQuery={deployedContracts} limit={50} />
      )}
    </div>
  );
}
