import type { ContractType } from "@/types/contracts";

export type ContractId = ContractType | string;

export type SourceFile = {
  filename: string | undefined;
  source: string;
};
