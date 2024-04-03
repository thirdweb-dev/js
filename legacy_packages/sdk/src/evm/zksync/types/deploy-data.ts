import { ContractInterface } from "ethers";
import { DeployedContractType } from "../../types/any-evm/deploy-data";

export type PrecomputedDeploymentTransaction = {
  predictedAddress: string;
  to: string;
  constructorCalldata: Uint8Array | undefined;
  bytecodeHash: string;
  abi: ContractInterface;
  bytecode: string;
  params: any[];
};

export type DeploymentPreset = {
  name?: string;
  type: DeployedContractType;
  transaction: PrecomputedDeploymentTransaction;
};
