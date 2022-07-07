import type { ContractType } from "@thirdweb-dev/sdk";

export type ContractId = ContractType | string;

export interface DeployableContractContractCellProps {
  cell: {
    value: ContractId;
  };
  release?: boolean;
}
