import { BytesLike } from "ethers";
import { PreDeployMetadataFetched } from "../../schema/contracts/custom";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";

export type PrecomputedDeploymentTransaction = {
  predictedAddress: string;
  to: string;
  data: string;
};

export type DeploymentPreset = {
  name?: string;
  type: DeployedContractType;
  transaction: PrecomputedDeploymentTransaction;
  encodedArgs?: BytesLike;
};

export type KeylessTransaction = {
  signer: string;
  transaction: string;
};

export type KeylessDeploymentInfo = {
  signer: string;
  transaction: string;
  deployment: string;
};

export type DeployedContractType =
  | "proxy"
  | "infra"
  | "implementation"
  | "create2Factory"
  | "plugin"
  | "extension"
  | "custom";

export type DeploymentTransaction = {
  contractType: DeployedContractType | string;
  addresses: string[];
};

type ConstructorParam = {
  type?: string;
  value: any | any[];
};

// Map a param-name to its type/value
export type ConstructorParamMap = Record<string, ConstructorParam>;

export type ContractOptions = {
  contractName?: string;
  publisherAddress?: AddressOrEns;
  version?: string;
  metadata?: PreDeployMetadataFetched;
  constructorParams?: ConstructorParamMap;
};
