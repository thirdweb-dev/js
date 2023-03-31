import { ContractType } from "../core";
import { Address, AddressOrEns } from "../schema";

export type ContractInput = {
  address: AddressOrEns;
  chainId: number;
};

export type AddContractInput = ContractInput & {
  metadataURI?: string;
};

export type DeployedContract = {
  address: Address;
  chainId: number;
};

export type ContractWithMetadata = {
  address: Address;
  chainId: number;
  contractType: () => Promise<ContractType>;
  metadata: () => Promise<{ name: string }>;
  extensions: () => Promise<string[]>;
};
