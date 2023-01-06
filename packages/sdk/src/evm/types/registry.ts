export type ContractInput = {
  address: string;
  chainId: number;
};

export type AddContractInput = ContractInput & {
  metadataURI?: string;
};

export type DeployedContract = {
  address: string;
  chainId: number;
};
