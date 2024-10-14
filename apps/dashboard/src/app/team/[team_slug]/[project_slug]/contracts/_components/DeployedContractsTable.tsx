"use client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { BasicContract } from "contract-ui/types/types";
import { DeployedContracts } from "../../../../../../components/contract-components/tables/deployed-contracts";

export function DeployedContractsTable(props: {
  contracts: BasicContract[];
}) {
  const router = useDashboardRouter();
  return (
    <DeployedContracts
      contractList={props.contracts}
      limit={50}
      isPending={false}
      onContractRemoved={router.refresh}
    />
  );
}
