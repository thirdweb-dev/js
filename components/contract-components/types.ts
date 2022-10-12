import type { AbiSchema, ContractType } from "@thirdweb-dev/sdk/evm";
import { z } from "zod";

export type ContractId = ContractType | string;
export type ContractCellContext = "deploy" | "create_release";

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

export type Abi = z.infer<typeof AbiSchema>;
