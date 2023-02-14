import { ContractType } from "../core";

export type ContractInput = {
  address: string;
  chainId: number;
};

export type AddContractInput = ContractInput & {
  metadataURI?: string;
};

export type DeployedContract = {
  address: string;
  chainId: number;
};

export type ContractWithMetadata = {
  address: string;
  chainId: number;
  contractType: () => Promise<ContractType>;
  metadata: () => Promise<{ name: string }>;
};
