import { ContractType } from "../contracts";
import { Abi } from "../schema/contracts/custom";
import type { Address } from "../schema/shared/Address";
import type { AddressOrEns } from "../schema/shared/AddressOrEnsSchema";

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
  metadata: () => Promise<{ name: string; image?: string }>;
  abi: () => Promise<Abi>;
  extensions: () => Promise<string[]>;
};
