import type { ContractType } from "constants/contracts";

export type ContractId = ContractType | string;

export type SourceFile = {
  filename: string | undefined;
  source: string;
};
