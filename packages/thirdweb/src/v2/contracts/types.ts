export type ContractCall = {
  contractAddress: string;
  method: string;
  params: unknown[];
  value?: string;
};
