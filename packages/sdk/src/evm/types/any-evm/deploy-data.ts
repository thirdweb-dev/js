import { InfraContractType } from "../../core";

export type DeployDataWithSigner = {
  initBytecodeWithSalt: string;
};

export type DeploymentInfo = {
  signerDeployData: DeployDataWithSigner;
  predictedAddress: string;
  infraContractsToDeploy: InfraContractType[];
};
