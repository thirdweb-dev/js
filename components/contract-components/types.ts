import type { ContractType } from "@thirdweb-dev/sdk";

export type ContractId = ContractType | string;
export type ContractCellContext = "deploy" | "publish";

export interface DeployableContractContractCellProps {
  cell: {
    value: ContractId;
  };
  context?: ContractCellContext;
}

export type SourceFile = {
  filename: string | undefined;
  source: string;
};
