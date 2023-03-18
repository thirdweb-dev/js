import { InfraContractType } from "../../core";

export type DeployDataKeyless = {
  keylessSigner: string;
  keylessTxnString: string;
};

export type DeployDataWithSigner = {
  initBytecodeWithSalt: string;
};

export type DeploymentInfo = {
  keylessData: DeployDataKeyless;
  signerDeployData: DeployDataWithSigner;
  predictedAddress: string;
  infraContractsToDeploy: InfraContractType[];
};
