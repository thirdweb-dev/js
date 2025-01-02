"use client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import type { BasicContract } from "contract-ui/types/types";

export function DeployedContractsTable(props: {
  contracts: BasicContract[];
}) {
  const router = useDashboardRouter();
  return (
    <DeployedContracts
      contractList={props.contracts}
      limit={50}
      onContractRemoved={router.refresh}
    />
  );
}
