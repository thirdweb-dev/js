import { DeployedContract } from "@thirdweb-dev/sdk";

export type ThirdwebConfig = {
  chainIds: number[];
  contracts: DeployedContract[];
};

export type GenerateOptions = {
  path: string;
  deployer?: string;
};

export type ContractChainPrompt = {
  address: string;
  chains: {
    slug: string;
    chainId: number;
  }[];
};
