import { NetworkInput, PrebuiltContractType } from "../../core/types";
import { SDKOptions } from "../../schema/sdk-options";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ContractInterface } from "ethers";

export type GetContractFromAbiParams = {
  address: string;
  abi: ContractInterface;
  network: NetworkInput;
  storage?: ThirdwebStorage;
  // TODO: Remove support for SDKOptions
  sdkOptions?: SDKOptions;
};

export type GetContractParams = {
  address: string;
  contractTypeOrAbi?: PrebuiltContractType | ContractInterface;
  network: NetworkInput;
  storage?: ThirdwebStorage;
  sdkOptions?: SDKOptions;
};
