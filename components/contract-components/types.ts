import type { ContractType } from "@thirdweb-dev/sdk";

export type ContractId = ContractType | string;
export type ContractCellContext =
  | "built-in"
  | "deploy"
  | "create_release"
  | "view_release";

export interface DeployableContractContractCellProps {
  cell: {
    value: ContractId;
  };
  context?: ContractCellContext;
}
