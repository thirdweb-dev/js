import { PreDeployMetadataFetched } from "../../schema";

export type PrecomputedDeploymentData = {
  predictedAddress: string;
  bytecode: string;
  encodedArgs: any;
};
export type PrecomputedDeploymentTransaction = {
  predictedAddress: string;
  to: string;
  data: string;
};

export type DeploymentPreset = {
  name?: string;
  type: DeployedContractType;
  transaction: PrecomputedDeploymentTransaction;
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
  | "custom";

export type DeploymentTransaction = {
  contractType: DeployedContractType | string;
  addresses: string[];
};

export type ConstructorParam = {
  type?: string;
  value: any | any[];
};

export type ConstructorParamMap = Record<string, ConstructorParam>;

export type ContractOptions = {
  contractName?: string;
  metadata?: PreDeployMetadataFetched;
  constructorParams?: ConstructorParamMap;
};
