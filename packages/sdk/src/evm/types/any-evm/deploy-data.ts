import { InfraContractType } from "../../core";

export type DeployDataKeyless = {
  keylessSigner: string;
  keylessTxnString: string;
  gasPrice: number;
  gasLimit: number;
};

export type DeployDataWithSigner = {
  initBytecodeWithSalt: string;
};

export type PrecomputedDeploymentData = {
  keylessData: DeployDataKeyless;
  signerDeployData: DeployDataWithSigner;
  predictedAddress: string;
  bytecode: string;
  encodedArgs: any;
};

export type DeploymentInfo = {
  keylessData: DeployDataKeyless;
  signerDeployData: DeployDataWithSigner;
  predictedAddress: string;
  infraContractsToDeploy: InfraContractType[];
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
